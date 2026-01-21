//! Anchor CLI - State-pinned development for blockchain applications.
//!
//! Commands:
//! - `anchor fork` - Create a local fork of a blockchain network
//! - `anchor forks` - List all active forks
//! - `anchor kill` - Terminate a fork
//! - `anchor kill-all` - Terminate all forks
//! - `anchor env` - Get environment variables for a fork
//! - `anchor snapshot` - Create a snapshot of current state
//! - `anchor snapshots` - List all snapshots
//! - `anchor revert` - Revert to a snapshot
//! - `anchor checkpoint` - Save full state checkpoint
//! - `anchor checkpoints` - List all checkpoints
//! - `anchor restore` - Restore from a checkpoint
//! - `anchor status` - Show current fork and task status

use clap::{Parser, Subcommand};
use sigil_anchor_core::{
    CheckpointManager, ForkManager, Network, RpcClient, SnapshotManager, Zone, VERSION,
};
use std::path::PathBuf;
use std::str::FromStr;

/// Default path for the fork registry.
fn default_registry_path() -> PathBuf {
    dirs::data_local_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join("anchor")
        .join("registry.json")
}

/// Anchor - State-pinned blockchain development
#[derive(Parser)]
#[command(name = "anchor")]
#[command(author, version, about, long_about = None)]
struct Cli {
    /// Set the zone for operations
    #[arg(short, long, global = true, default_value = "standard")]
    zone: String,

    /// Path to the fork registry file
    #[arg(long, global = true, env = "ANCHOR_REGISTRY")]
    registry: Option<PathBuf>,

    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Create a local fork of a blockchain network
    Fork {
        /// Network to fork (mainnet, sepolia, base, arbitrum, optimism, berachain)
        #[arg(short, long, default_value = "mainnet")]
        network: String,

        /// Block number to fork from (latest if not specified)
        #[arg(short, long)]
        block: Option<u64>,

        /// Port to run the fork on
        #[arg(short, long)]
        port: Option<u16>,

        /// Session ID to associate with this fork
        #[arg(short, long)]
        session: Option<String>,
    },

    /// List all active forks
    Forks {
        /// Output as JSON
        #[arg(long)]
        json: bool,
    },

    /// Terminate a fork
    Kill {
        /// Fork ID to terminate
        fork_id: String,
    },

    /// Terminate all forks
    KillAll,

    /// Get environment variables for a fork
    Env {
        /// Fork ID
        fork_id: String,

        /// Export format (shell export statements)
        #[arg(long)]
        export: bool,
    },

    /// Validate code against forked state
    Ground {
        /// Path to the file or directory to validate
        path: String,
    },

    /// Create a snapshot of current EVM state
    Snapshot {
        /// Fork ID to snapshot
        fork_id: String,

        /// Session ID to associate with the snapshot
        #[arg(short, long)]
        session: Option<String>,

        /// Description for the snapshot
        #[arg(short, long)]
        description: Option<String>,
    },

    /// List all snapshots
    Snapshots {
        /// Fork ID to list snapshots for
        fork_id: String,

        /// Filter by session ID
        #[arg(short, long)]
        session: Option<String>,

        /// Output as JSON
        #[arg(long)]
        json: bool,
    },

    /// Revert to a snapshot
    Revert {
        /// Fork ID
        fork_id: String,

        /// Snapshot ID to revert to
        snapshot_id: String,
    },

    /// Save a full state checkpoint
    Checkpoint {
        /// Fork ID to checkpoint
        fork_id: String,

        /// Session ID (required for checkpoints)
        #[arg(short, long)]
        session: String,

        /// Description for the checkpoint
        #[arg(short, long)]
        description: Option<String>,
    },

    /// List all checkpoints
    Checkpoints {
        /// Session ID to list checkpoints for
        session: String,

        /// Output as JSON
        #[arg(long)]
        json: bool,
    },

    /// Restore from a checkpoint
    Restore {
        /// Fork ID to restore to
        fork_id: String,

        /// Checkpoint ID to restore from
        checkpoint_id: String,

        /// Session ID
        #[arg(short, long)]
        session: String,
    },

    /// Show current fork and task status
    Status,

    /// Show version information
    Version,
}

#[tokio::main]
async fn main() {
    let cli = Cli::parse();

    // Parse zone
    let zone = match cli.zone.to_lowercase().as_str() {
        "critical" => Zone::Critical,
        "elevated" => Zone::Elevated,
        "standard" => Zone::Standard,
        "local" => Zone::Local,
        _ => {
            eprintln!("Invalid zone: {}. Using 'standard'.", cli.zone);
            Zone::Standard
        }
    };

    // Get registry path
    let registry_path = cli.registry.unwrap_or_else(default_registry_path);

    // Create fork manager
    let mut manager = ForkManager::new(&registry_path);
    if let Err(e) = manager.load_registry().await {
        eprintln!("Warning: Failed to load registry: {}", e);
    }

    match cli.command {
        Some(Commands::Fork {
            network,
            block,
            port,
            session,
        }) => {
            let net = match Network::from_str(&network) {
                Ok(n) => n,
                Err(e) => {
                    eprintln!("Error: {}", e);
                    std::process::exit(6); // SCHEMA error
                }
            };

            println!("Creating fork...");
            println!("  Network: {} (chain ID: {})", net.name(), net.chain_id());
            println!(
                "  Block: {}",
                block.map_or("latest".to_string(), |b| b.to_string())
            );
            if let Some(p) = port {
                println!("  Port: {}", p);
            }
            println!("  Zone: {}", zone);

            match manager.fork(net, block, port, session).await {
                Ok(fork) => {
                    println!("\nFork created successfully!");
                    println!("  ID: {}", fork.id);
                    println!("  RPC URL: {}", fork.rpc_url);
                    println!("  Block: {}", fork.block_number);
                    println!("  Port: {}", fork.port);
                    println!("  PID: {}", fork.pid);
                }
                Err(e) => {
                    eprintln!("Error creating fork: {}", e);
                    std::process::exit(4); // REVERT error
                }
            }
        }

        Some(Commands::Forks { json }) => {
            let forks = manager.all();

            if json {
                match serde_json::to_string_pretty(&forks) {
                    Ok(output) => println!("{}", output),
                    Err(e) => {
                        eprintln!("Error serializing forks: {}", e);
                        std::process::exit(6);
                    }
                }
            } else if forks.is_empty() {
                println!("No active forks.");
            } else {
                println!("Active forks:");
                println!();
                for fork in forks {
                    println!("  {} ({})", fork.id, fork.network.name());
                    println!("    RPC: {}", fork.rpc_url);
                    println!("    Block: {}", fork.block_number);
                    println!("    PID: {}", fork.pid);
                    if let Some(ref session) = fork.session_id {
                        println!("    Session: {}", session);
                    }
                    println!();
                }
            }
        }

        Some(Commands::Kill { fork_id }) => match manager.kill(&fork_id).await {
            Ok(()) => {
                println!("Fork {} terminated.", fork_id);
            }
            Err(e) => {
                eprintln!("Error killing fork: {}", e);
                std::process::exit(4);
            }
        },

        Some(Commands::KillAll) => {
            let count = manager.all().len();
            match manager.kill_all().await {
                Ok(()) => {
                    println!("Terminated {} fork(s).", count);
                }
                Err(e) => {
                    eprintln!("Error killing forks: {}", e);
                    std::process::exit(4);
                }
            }
        }

        Some(Commands::Env { fork_id, export }) => match manager.get(&fork_id) {
            Some(fork) => {
                if export {
                    println!("export FORK_RPC_URL=\"{}\"", fork.rpc_url);
                    println!("export FORK_CHAIN_ID=\"{}\"", fork.network.chain_id());
                    println!("export FORK_BLOCK_NUMBER=\"{}\"", fork.block_number);
                    println!("export FORK_ID=\"{}\"", fork.id);
                } else {
                    println!("FORK_RPC_URL={}", fork.rpc_url);
                    println!("FORK_CHAIN_ID={}", fork.network.chain_id());
                    println!("FORK_BLOCK_NUMBER={}", fork.block_number);
                    println!("FORK_ID={}", fork.id);
                }
            }
            None => {
                eprintln!("Fork not found: {}", fork_id);
                std::process::exit(6);
            }
        },

        Some(Commands::Ground { path }) => {
            println!("Grounding validation for: {}", path);
            println!("  Zone: {}", zone);
            println!("\nGrounding validation not yet implemented.");
        }

        Some(Commands::Snapshot {
            fork_id,
            session,
            description,
        }) => {
            // Get fork to verify it exists and get RPC URL
            let fork = match manager.get(&fork_id) {
                Some(f) => f.clone(),
                None => {
                    eprintln!("Fork not found: {}", fork_id);
                    std::process::exit(6);
                }
            };

            // Create snapshot manager
            let client = RpcClient::new(&fork.rpc_url);
            let snapshot_registry_path = registry_path
                .parent()
                .unwrap_or(&registry_path)
                .join("snapshots")
                .join(format!("{}.json", fork_id));

            let mut snapshot_manager =
                SnapshotManager::new(client, &fork_id, &snapshot_registry_path);
            if let Err(e) = snapshot_manager.load_registry().await {
                eprintln!("Warning: Failed to load snapshot registry: {}", e);
            }

            match snapshot_manager.create(session, None, description).await {
                Ok(snapshot) => {
                    println!("Snapshot created successfully!");
                    println!("  ID: {}", snapshot.id);
                    println!("  Fork: {}", snapshot.fork_id);
                    println!("  Block: {}", snapshot.block_number);
                    if let Some(ref sess) = snapshot.session_id {
                        println!("  Session: {}", sess);
                    }
                    if let Some(ref desc) = snapshot.description {
                        println!("  Description: {}", desc);
                    }
                }
                Err(e) => {
                    eprintln!("Error creating snapshot: {}", e);
                    std::process::exit(4);
                }
            }
        }

        Some(Commands::Snapshots {
            fork_id,
            session,
            json,
        }) => {
            // Get fork to verify it exists
            if manager.get(&fork_id).is_none() {
                eprintln!("Fork not found: {}", fork_id);
                std::process::exit(6);
            }

            // Create snapshot manager
            let snapshot_registry_path = registry_path
                .parent()
                .unwrap_or(&registry_path)
                .join("snapshots")
                .join(format!("{}.json", fork_id));

            let client = RpcClient::new("http://localhost:8545"); // Not used for listing
            let mut snapshot_manager =
                SnapshotManager::new(client, &fork_id, &snapshot_registry_path);
            if let Err(e) = snapshot_manager.load_registry().await {
                eprintln!("Warning: Failed to load snapshot registry: {}", e);
            }

            let snapshots: Vec<_> = if let Some(ref sess) = session {
                snapshot_manager
                    .list_by_session(sess)
                    .into_iter()
                    .cloned()
                    .collect()
            } else {
                snapshot_manager.list().to_vec()
            };

            if json {
                match serde_json::to_string_pretty(&snapshots) {
                    Ok(output) => println!("{}", output),
                    Err(e) => {
                        eprintln!("Error serializing snapshots: {}", e);
                        std::process::exit(6);
                    }
                }
            } else if snapshots.is_empty() {
                println!("No snapshots for fork {}.", fork_id);
            } else {
                println!("Snapshots for fork {}:", fork_id);
                println!();
                for snapshot in snapshots {
                    println!("  {}", snapshot.id);
                    println!("    Block: {}", snapshot.block_number);
                    println!("    Created: {}", snapshot.created_at);
                    if let Some(ref sess) = snapshot.session_id {
                        println!("    Session: {}", sess);
                    }
                    if let Some(ref desc) = snapshot.description {
                        println!("    Description: {}", desc);
                    }
                    println!();
                }
            }
        }

        Some(Commands::Revert {
            fork_id,
            snapshot_id,
        }) => {
            // Get fork to verify it exists and get RPC URL
            let fork = match manager.get(&fork_id) {
                Some(f) => f.clone(),
                None => {
                    eprintln!("Fork not found: {}", fork_id);
                    std::process::exit(6);
                }
            };

            // Create snapshot manager
            let client = RpcClient::new(&fork.rpc_url);
            let snapshot_registry_path = registry_path
                .parent()
                .unwrap_or(&registry_path)
                .join("snapshots")
                .join(format!("{}.json", fork_id));

            let mut snapshot_manager =
                SnapshotManager::new(client, &fork_id, &snapshot_registry_path);
            if let Err(e) = snapshot_manager.load_registry().await {
                eprintln!("Warning: Failed to load snapshot registry: {}", e);
            }

            match snapshot_manager.revert(&snapshot_id).await {
                Ok(()) => {
                    println!("Reverted to snapshot {}.", snapshot_id);
                }
                Err(e) => {
                    eprintln!("Error reverting to snapshot: {}", e);
                    std::process::exit(4);
                }
            }
        }

        Some(Commands::Checkpoint {
            fork_id,
            session,
            description,
        }) => {
            // Get fork to verify it exists and get RPC URL
            let fork = match manager.get(&fork_id) {
                Some(f) => f.clone(),
                None => {
                    eprintln!("Fork not found: {}", fork_id);
                    std::process::exit(6);
                }
            };

            // Create checkpoint manager
            let client = RpcClient::new(&fork.rpc_url);
            let checkpoint_registry_path = registry_path
                .parent()
                .unwrap_or(&registry_path)
                .join("checkpoints")
                .join(format!("{}.json", session));
            let checkpoints_dir = registry_path
                .parent()
                .unwrap_or(&registry_path)
                .join("checkpoints")
                .join("data");

            let mut checkpoint_manager = CheckpointManager::new(
                client,
                &fork_id,
                &session,
                &checkpoint_registry_path,
                &checkpoints_dir,
            );
            if let Err(e) = checkpoint_manager.load_registry().await {
                eprintln!("Warning: Failed to load checkpoint registry: {}", e);
            }

            match checkpoint_manager.save(description).await {
                Ok(checkpoint) => {
                    println!("Checkpoint saved successfully!");
                    println!("  ID: {}", checkpoint.id);
                    println!("  Fork: {}", checkpoint.fork_id);
                    println!("  Session: {}", checkpoint.session_id);
                    println!("  Block: {}", checkpoint.block_number);
                    println!("  Size: {} bytes", checkpoint.size_bytes);
                    if let Some(ref desc) = checkpoint.description {
                        println!("  Description: {}", desc);
                    }
                }
                Err(e) => {
                    eprintln!("Error saving checkpoint: {}", e);
                    std::process::exit(4);
                }
            }
        }

        Some(Commands::Checkpoints { session, json }) => {
            // Create checkpoint manager
            let checkpoint_registry_path = registry_path
                .parent()
                .unwrap_or(&registry_path)
                .join("checkpoints")
                .join(format!("{}.json", session));
            let checkpoints_dir = registry_path
                .parent()
                .unwrap_or(&registry_path)
                .join("checkpoints")
                .join("data");

            let client = RpcClient::new("http://localhost:8545"); // Not used for listing
            let mut checkpoint_manager = CheckpointManager::new(
                client,
                "unused",
                &session,
                &checkpoint_registry_path,
                &checkpoints_dir,
            );
            if let Err(e) = checkpoint_manager.load_registry().await {
                eprintln!("Warning: Failed to load checkpoint registry: {}", e);
            }

            let checkpoints = checkpoint_manager.list();

            if json {
                match serde_json::to_string_pretty(&checkpoints) {
                    Ok(output) => println!("{}", output),
                    Err(e) => {
                        eprintln!("Error serializing checkpoints: {}", e);
                        std::process::exit(6);
                    }
                }
            } else if checkpoints.is_empty() {
                println!("No checkpoints for session {}.", session);
            } else {
                println!("Checkpoints for session {}:", session);
                println!();
                for checkpoint in checkpoints {
                    println!("  {}", checkpoint.id);
                    println!("    Fork: {}", checkpoint.fork_id);
                    println!("    Block: {}", checkpoint.block_number);
                    println!("    Size: {} bytes", checkpoint.size_bytes);
                    println!("    Created: {}", checkpoint.created_at);
                    if let Some(ref desc) = checkpoint.description {
                        println!("    Description: {}", desc);
                    }
                    println!();
                }
            }
        }

        Some(Commands::Restore {
            fork_id,
            checkpoint_id,
            session,
        }) => {
            // Get fork to verify it exists and get RPC URL
            let fork = match manager.get(&fork_id) {
                Some(f) => f.clone(),
                None => {
                    eprintln!("Fork not found: {}", fork_id);
                    std::process::exit(6);
                }
            };

            // Create checkpoint manager
            let client = RpcClient::new(&fork.rpc_url);
            let checkpoint_registry_path = registry_path
                .parent()
                .unwrap_or(&registry_path)
                .join("checkpoints")
                .join(format!("{}.json", session));
            let checkpoints_dir = registry_path
                .parent()
                .unwrap_or(&registry_path)
                .join("checkpoints")
                .join("data");

            let mut checkpoint_manager = CheckpointManager::new(
                client,
                &fork_id,
                &session,
                &checkpoint_registry_path,
                &checkpoints_dir,
            );
            if let Err(e) = checkpoint_manager.load_registry().await {
                eprintln!("Warning: Failed to load checkpoint registry: {}", e);
            }

            match checkpoint_manager.restore(&checkpoint_id).await {
                Ok(()) => {
                    println!("Restored from checkpoint {}.", checkpoint_id);
                }
                Err(e) => {
                    eprintln!("Error restoring from checkpoint: {}", e);
                    std::process::exit(4);
                }
            }
        }

        Some(Commands::Status) => {
            println!("Anchor Status");
            println!("  Version: {}", VERSION);
            println!("  Zone: {}", zone);
            println!("  Registry: {}", registry_path.display());
            println!();

            let forks = manager.all();
            if forks.is_empty() {
                println!("No active forks.");
            } else {
                println!("Active forks: {}", forks.len());
                for fork in forks {
                    println!("  - {} ({}:{})", fork.id, fork.network.name(), fork.port);
                }
            }
        }

        Some(Commands::Version) => {
            println!("Anchor v{}", VERSION);
        }

        None => {
            println!("Anchor v{} - State-pinned blockchain development", VERSION);
            println!("\nUse --help for usage information.");
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use clap::CommandFactory;

    #[test]
    fn verify_cli() {
        // Verify CLI structure is valid
        Cli::command().debug_assert();
    }

    #[test]
    fn test_zone_parsing() {
        let zone_str = "critical";
        let zone = match zone_str {
            "critical" => Zone::Critical,
            "elevated" => Zone::Elevated,
            "standard" => Zone::Standard,
            "local" => Zone::Local,
            _ => Zone::Standard,
        };
        assert_eq!(zone, Zone::Critical);
    }

    #[test]
    fn test_default_registry_path() {
        let path = default_registry_path();
        assert!(path.to_string_lossy().contains("anchor"));
        assert!(path.to_string_lossy().contains("registry.json"));
    }
}
