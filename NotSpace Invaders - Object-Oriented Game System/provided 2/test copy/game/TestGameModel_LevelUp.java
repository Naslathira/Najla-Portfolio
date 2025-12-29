import game.GameModel;
import game.achievements.PlayerStatsTracker;
import game.core.Ship;
import game.utility.Logger;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;

/**
 * Unit tests for the GameModel's levelUp() method.
 *
 * These tests verify that:
 * - The level and spawn rate increase when the score reaches the threshold.
 * - No changes occur if the score is below the threshold.
 */
public class TestGameModel_LevelUp {

    private GameModel model;
    private Ship ship;

    /**
     * Set up a GameModel and Ship instance before each test using a dummy logger and real tracker.
     */
    @Before
    public void setUp() {
        // Dummy logger that ignores messages
        Logger dummyLogger = message -> {};
        // Create game model with dummy logger and stats tracker
        model = new GameModel(dummyLogger, new PlayerStatsTracker());
        // Get reference to the ship
        ship = model.getShip();
    }

    /**
     * Test that calling levelUp() increases the level and spawn rate
     * when the ship's score meets the threshold (100 points).
     */
    @Test
    public void testLevelUpWhenScoreIsEnough() {
        // Set the ship's score to the exact threshold needed to level up
        ship.addScore(100);

        // Capture current level and spawn rate
        int initialLevel = model.getLevel();
        int initialSpawnRate = getSpawnRate(model);

        // Attempt to level up
        model.levelUp();

        // Expect level to increase by 1
        assertEquals(initialLevel + 1, model.getLevel());

        // Expect spawn rate to increase by SPAWN_RATE_INCREASE (usually 5)
        assertEquals(initialSpawnRate + 5, getSpawnRate(model));
    }

    /**
     * Test that calling levelUp() does nothing when the score is below the threshold.
     */
    @Test
    public void testLevelDoesNotIncreaseIfScoreTooLow() {
        // Score is 0 by default (below threshold)

        int initialLevel = model.getLevel();
        int initialSpawnRate = getSpawnRate(model);

        // Attempt to level up without sufficient score
        model.levelUp();

        // Level and spawn rate should remain unchanged
        assertEquals(initialLevel, model.getLevel());
        assertEquals(initialSpawnRate, getSpawnRate(model));
    }

    /**
     * Helper method to access the private spawnRate field from GameModel using reflection.
     *
     * @param model the GameModel instance
     * @return the current spawn rate value
     */
    private int getSpawnRate(GameModel model) {
        try {
            java.lang.reflect.Field field = GameModel.class.getDeclaredField("spawnRate");
            field.setAccessible(true);
            return field.getInt(model);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
