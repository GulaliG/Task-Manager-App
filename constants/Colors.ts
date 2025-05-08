/**
 * App-wide color constants for consistent theming and styling
 */
const Colors = {
  /** Primary UI actions: buttons, links */
  primary: '#007AFF',

  /** Background color for screens */
  background: '#FFFFFF',

  /** Background color for cards, inputs, etc. */
  card: '#F5F5F5',

  /** Main text color */
  text: '#333333',

  /** Subtext or muted informational text */
  mutedText: '#777777',

  /** Used for errors, deletions, destructive actions */
  danger: '#FF3B30',

  /** Used for warning or "in progress" state */
  warning: '#FF9500',

  /** Used for success state or completed tasks */
  success: '#34C759',

  /** For borders, dividers, light shadows */
  border: '#E0E0E0',
} as const;

export default Colors;
