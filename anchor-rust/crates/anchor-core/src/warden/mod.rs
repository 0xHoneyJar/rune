//! Warden module for Sigil rules loading and validation.
//!
//! This module provides loaders for:
//! - Physics rules (sync strategy, timing, confirmation)
//! - Vocabulary/lexicon (keyword to effect mapping)
//! - Effect resolution from keywords and types

mod physics;
mod vocabulary;

pub use physics::{get_default_physics, load_physics, load_physics_cached, PhysicsLoader};
pub use vocabulary::{
    resolve_effect_from_keywords, KeywordCategory, TypeOverride, Vocabulary, VocabularyLoader,
};

#[cfg(test)]
pub use physics::clear_physics_cache;
