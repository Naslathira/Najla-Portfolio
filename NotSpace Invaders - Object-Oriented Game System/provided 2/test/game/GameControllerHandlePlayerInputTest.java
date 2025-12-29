import game.GameController;
import game.GameModel;
import game.achievements.AchievementFile;
import game.achievements.AchievementManager;
import game.achievements.PlayerStatsTracker;
import game.core.Ship;
import game.core.SpaceObject;
import game.exceptions.BoundaryExceededException;
import game.ui.KeyHandler;
import game.ui.Tickable;
import game.ui.UI;
import game.utility.Direction;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

import static org.junit.Assert.*;

public class GameControllerHandlePlayerInputTest {

    private GameController controller;
    private GameModel model;
    private Ship ship;

    @Before
    public void setUp() {
        MockUI ui = new MockUI();
        model = new GameModel(System.out::println, new PlayerStatsTracker());
        AchievementManager manager = new AchievementManager(new AchievementFile() {
            @Override
            public void setFileLocation(String fileLocation) {

            }

            @Override
            public String getFileLocation() {
                return null;
            }

            public void save(String s) {} // dummy

            @Override
            public List<String> read() {
                return null;
            }
        });
        controller = new GameController(ui, model, manager);
        ship = model.getShip(); // <- tambahkan ini

    }

    /**
     * Static mock UI class as per Gradescope recommendation.
     */
    static class MockUI implements UI {
        public void start() {}
        public void pause() {}
        public void stop() {}
        public void onStep(Tickable tickable) {}
        public void onKey(KeyHandler key) {}
        public void render(List<SpaceObject> objects) {}
        public void log(String message) {}
        public void setStat(String label, String value) {}
        public void logAchievementMastered(String message) {}
        public void logAchievements(List achievements) {}
        public void setAchievementProgressStat(String name, double progressPercentage) {}
    }

    @Test
    public void testInputIgnoredWhenPaused() {
        int initialX = model.getShip().getX();
        int initialY = model.getShip().getY();

        controller.handlePlayerInput("P"); // pause
        controller.handlePlayerInput("W"); // should be ignored

        assertEquals(initialX, model.getShip().getX());
        assertEquals(initialY, model.getShip().getY());
    }

    @Test
    public void testInputUnpausedAfterPause() {
        int expectedY = model.getShip().getY() - 1;

        controller.handlePlayerInput("P"); // pause
        controller.handlePlayerInput("P"); // unpause
        controller.handlePlayerInput("W"); // should be processed

        assertEquals(expectedY, model.getShip().getY());
    }



    @Test
    public void testFireBulletAndTrackShot() {
        int before = model.getSpaceObjects().size();
        int beforeShots = model.getStatsTracker().getShotsFired();

        controller.handlePlayerInput("F");

        int after = model.getSpaceObjects().size();
        int afterShots = model.getStatsTracker().getShotsFired();

        assertEquals(before + 1, after);
        assertEquals(beforeShots + 1, afterShots);
    }

    @Test
    public void testInvalidInputStillHandled() {
        int initialX = model.getShip().getX();
        int initialY = model.getShip().getY();

        controller.handlePlayerInput("X"); // invalid key

        assertEquals(initialX, model.getShip().getX());
        assertEquals(initialY, model.getShip().getY());
    }

    @Test
    public void testShipCannotMoveLeftOutOfBounds() {
        Ship ship = model.getShip();

        // Move ship as far left as possible (with safety cap to avoid infinite loop)
        int attempts = 50;
        while (ship.getX() > 0 && attempts-- > 0) {
            try {
                ship.move(Direction.LEFT);
            } catch (BoundaryExceededException e) {
                fail("Exception thrown before reaching boundary: " + e.getMessage());
            }
        }

        int originalX = ship.getX();

        // Try one more move which should throw exception but not change position
        try {
            ship.move(Direction.LEFT);
            fail("Expected BoundaryExceededException not thrown");
        } catch (BoundaryExceededException ignored) {
            // expected
        }

        assertEquals("Ship should not go out of left boundary", originalX, ship.getX());
        assertTrue("Ship must remain within game boundary", ship.getX() >= 0);
    }

}
