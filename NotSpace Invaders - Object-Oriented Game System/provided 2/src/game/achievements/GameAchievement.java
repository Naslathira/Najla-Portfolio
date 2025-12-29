package game.achievements;

/**
 * A concrete implementation of the Achievement interface.
 *
 * <p>This class represents a single in-game achievement with progress tracking.
 * Progress is represented as a value between 0.0 and 1.0.
 * The tier of the achievement is derived from the progress value:
 * <ul>
 *   <li>"Novice" if progress &lt; 0.5</li>
 *   <li>"Expert" if 0.5 &le; progress &lt; 0.999</li>
 *   <li>"Master" if progress &ge; 0.999</li>
 * </ul>
 */
public class GameAchievement implements Achievement {
    private final String name;
    private final String description;
    private double progress;

    /**
     * Constructs a GameAchievement with the specified name and description.
     * The initial progress is 0.
     *
     * @param name        the unique name (non-null, non-empty)
     * @param description the achievement description (non-null, non-empty)
     * @throws IllegalArgumentException if name or description is null or empty
     */
    public GameAchievement(String name, String description) {
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Name must be non-null and non-empty");
        }
        if (description == null || description.isEmpty()) {
            throw new IllegalArgumentException("Description must be non-null and non-empty");
        }
        this.name = name;
        this.description = description;
        this.progress = 0.0;
    }

    /**
     * Returns the unique name of the achievement.
     *
     * @return the unique name of the achievement
     */
    @Override
    public String getName() {
        return name;
    }

    /**
     * Returns a description of the achievement.
     *
     * @return a description of the achievement
     */
    @Override
    public String getDescription() {
        return description;
    }

    /**
     * Returns the current progress as a double between 0.0 (0%) and 1.0 (100%).
     * <p>
     * Ensures:
     * 0.0 <= getProgress() <= 1.0
     *
     * @return the current progress value
     */
    @Override
    public double getProgress() {
        return progress;
    }

    /**
     * Sets the progress to the specified value.
     * <p>
     * Requires:
     * newProgress is between 0.0 and 1.0, inclusive.
     * <p>
     * Ensures:
     * getProgress() == newProgress,
     * getProgress() <= 1.0 after the update (i.e., progress is capped at 1.0),
     * getProgress() >= 0.0 after the update.
     *
     * @param newProgress the updated progress value
     */
    @Override
    public void setProgress(double newProgress) {
        // Ensure progress is not below 0
        if (newProgress < 0.0) {
            this.progress = 0.0;
        } else if (newProgress > 1.0) {  // Ensure progress is not above 1
            this.progress = 1.0;
        } else { // Set progress directly if within range
            this.progress = newProgress;
        }
    }

    /**
     * Returns the current tier based on the progress value.
     * <p>
     * Returns "Novice" if getProgress() < 0.5,
     * "Expert" if 0.5 <= getProgress() < 0.999,
     * and "Master" if getProgress() >= 0.999.
     *
     * @return the current tier string ("Novice", "Expert", "Master")
     */

    @Override
    public String getCurrentTier() {
        // 1. Check if progress is below 50%
        // 2. Check if progress is between 50% (inclusive) and just below 99.9%
        // 3. Otherwise, progress is effectively 100%
        if (progress < 0.5) {
            return "Novice";
        } else if (progress < 0.999) {
            return "Expert";
        } else {
            return "Master";
        }
    }

    /**
     * Compares this GameAchievement to another object for equality.
     * Two GameAchievement objects are considered equal if their names are equal.
     *
     * @param obj the object to compare to
     * @return true if the other object is a GameAchievement with the same name; false otherwise
     */
    @Override
    public boolean equals(Object obj) {
        // Check if both references point to the same object
        if (this == obj) {
            return true;
        }
        // Check if the other object is not a GameAchievement → return false if type mismatch
        if (!(obj instanceof GameAchievement)) {
            return false;
        }
        // Cast to GameAchievement and compare names
        GameAchievement other = (GameAchievement) obj;
        return this.name.equals(other.name);
    }

    /**
     * Returns the hash code for this GameAchievement.
     * The hash code is based solely on the achievement's name.
     *
     * @return the hash code
     */
    @Override
    public int hashCode() {
        // Generate hash based on the name string
        return name.hashCode();
    }
}
