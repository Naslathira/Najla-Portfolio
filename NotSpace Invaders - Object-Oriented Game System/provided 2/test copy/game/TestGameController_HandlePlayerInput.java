import game.GameController;
import game.GameModel;
import game.achievements.*;
import game.core.Ship;
import game.core.SpaceObject;
import game.ui.KeyHandler;
import game.ui.Tickable;
import game.ui.UI;

import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

/**
 * Unit tests for verifying player movement handling in GameController.
 */
public class TestGameController_HandlePlayerInput {

    private GameController controller;
    private Ship ship;

    @Before
    public void setUp() {
        // Use dummy UI to avoid launching the real UI during testing
        UI dummyUI = new UI() {
            @Override public void start() {}
            @Override public void pause() {}
            @Override public void stop() {}
            @Override public void onStep(Tickable tickable) {}
            @Override public void onKey(KeyHandler key) {}
            @Override public void render(List<SpaceObject> objects) {}
            @Override public void log(String message) {}
            @Override public void setStat(String label, String value) {}
            @Override public void logAchievementMastered(String message) {}
            @Override public void logAchievements(List<Achievement> achievements) {}
            @Override public void setAchievementProgressStat(String achievementName, double progressPercentage) {}
        };

        // Create a model with dummy logger and real stats tracker
        GameModel model = new GameModel(dummyUI::log, new PlayerStatsTracker());

        // Create controller with dummy UI and model; achievements set to null for now
        controller = new GameController(dummyUI, model, null);

        // Get reference to the ship for position checks
        ship = model.getShip();
    }

    @Test
    public void testMoveAllDirections() {
        // Record initial position
        int initialX = ship.getX();
        int initialY = ship.getY();

        // Move up
        controller.handlePlayerInput("W");
        assertEquals(initialY - 1, ship.getY());

        // Move down (back to original Y)
        controller.handlePlayerInput("S");
        assertEquals(initialY, ship.getY());

        // Move left
        controller.handlePlayerInput("A");
        assertEquals(initialX - 1, ship.getX());

        // Move right (back to original X)
        controller.handlePlayerInput("D");
        assertEquals(initialX, ship.getX());
    }

    @Test
    public void testStayInBoundsWhenOutOfBounds() {
        // Move up until it hits the upper boundary
        while (ship.getY() > 0) {
            controller.handlePlayerInput("W");
        }
        int minY = ship.getY();
        controller.handlePlayerInput("W"); // try again (should not move)
        assertEquals(minY, ship.getY());

        // Move left until it hits the left boundary
        while (ship.getX() > 0) {
            controller.handlePlayerInput("A");
        }
        int minX = ship.getX();
        controller.handlePlayerInput("A"); // try again (should not move)
        assertEquals(minX, ship.getX());

        // Move down until it hits the bottom boundary
        while (ship.getY() < GameModel.GAME_HEIGHT - 1) {
            controller.handlePlayerInput("S");
        }
        int maxY = ship.getY();
        controller.handlePlayerInput("S"); // try again (should not move)
        assertEquals(maxY, ship.getY());

        // Move right until it hits the right boundary
        while (ship.getX() < GameModel.GAME_WIDTH - 1) {
            controller.handlePlayerInput("D");
        }
        int maxX = ship.getX();
        controller.handlePlayerInput("D"); // try again (should not move)
        assertEquals(maxX, ship.getX());
    }

    @Test
    public void testMoveIgnoredWhenPaused() {
        controller.handlePlayerInput("P"); // Pause the game
        int initialX = ship.getX();
        int initialY = ship.getY();

        controller.handlePlayerInput("W"); // Attempt to move while paused
        assertEquals(initialX, ship.getX()); // Should not move horizontally
        assertEquals(initialY, ship.getY()); // Should not move vertically
    }
}
