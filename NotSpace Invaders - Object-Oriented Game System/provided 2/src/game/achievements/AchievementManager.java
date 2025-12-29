package game.achievements;

import java.util.ArrayList;
import java.util.List;
import java.util.HashSet;
import java.util.Set;

/**
 * GameAchievementManager coordinates achievement updates and file persistence management.
 *
 * <p>Responsibilities include:
 * <ul>
 *   <li>Registering new achievements</li>
 *   <li>Updating achievement progress</li>
 *   <li>Logging mastered achievements using {@code AchievementFile}</li>
 *   <li>Providing access to the current list of achievements</li>
 * </ul>
 */
public class AchievementManager {

    private final AchievementFile achievementFile;
    private Set<Achievement> achievements = new HashSet<>();
    private Set<String> loggedAchievements = new HashSet<>();

    /**
     * Constructs an AchievementManager with the specified AchievementFile.
     *
     * @param achievementFile the AchievementFile instance to use (non-null)
     * @throws IllegalArgumentException if achievementFile is null
     */
    public AchievementManager(AchievementFile achievementFile) {
        if (achievementFile == null) {
            throw new IllegalArgumentException("AchievementFile cannot be null");
        }
        this.achievementFile = achievementFile;
    }

    /**
     * Registers a new achievement.
     *
     * @param achievement the Achievement to register
     * @throws IllegalArgumentException if achievement is null or already registered
     */
    public void addAchievement(Achievement achievement) {
        if (achievement == null) {
            throw new IllegalArgumentException("Achievement cannot be null");
        }
        if (achievements.contains(achievement)) {
            throw new IllegalArgumentException("Achievement is already registered");
        }
        achievements.add(achievement);
    }

    /**
     * Sets the progress of the specified achievement to a given amount.
     *
     * @param achievementName the name of the achievement
     * @param absoluteProgressValue the value to set the achievement's progress to (typically between 0.0 and 1.0)
     * @throws IllegalArgumentException if the name is null, empty, or no matching achievement is found
     * @requires achievementName must be a non-null, non-empty string identifying a registered achievement
     */
    public void updateAchievement(String achievementName, double absoluteProgressValue) {
        if (achievementName == null || achievementName.isEmpty()) {
            throw new IllegalArgumentException("Achievement name must be non-null and non-empty");
        }

        Achievement target = null;
        for (Achievement achievement : achievements) {
            if (achievement.getName().equals(achievementName)) {
                target = achievement;
                break;
            }
        }

        if (target == null) {
            throw new IllegalArgumentException("No achievement registered under the provided name");
        }

        target.setProgress(absoluteProgressValue);
    }

    /**
     * Checks all registered achievements.
     * <p>
     * For any achievement that is considered mastered (progress >= 99.9%)
     * and has not yet been logged, this method logs the achievement via
     * {@code AchievementFile} and marks it as logged to avoid duplicate entries.
     */
    public void logAchievementMastered() {
        for (Achievement achievement : achievements) {
            if (achievement.getProgress() >= 0.999
                    && !loggedAchievements.contains(achievement.getName())) {
                achievementFile.save("Mastered: " + achievement.getName());
                loggedAchievements.add(achievement.getName());
            }
        }
    }

    /**
     * Returns a list of all registered achievements.
     *
     * @return a List of Achievement objects
     */
    public List<Achievement> getAchievements() {
        return new ArrayList<>(achievements);
    }

}
