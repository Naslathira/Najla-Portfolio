import game.GameModel;
import game.core.SpaceObject;
import game.achievements.PlayerStatsTracker;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

/**
 * Unit test for GameModel.updateGame().
 *
 * This class tests whether GameModel correctly removes out-of-bounds objects
 * and retains in-bounds objects during game updates.
 */
public class TestGameModel_UpdateGame {

    private GameModel model;

    /**
     * A dummy space object that is positioned outside the bottom boundary
     * of the game (y > GAME_HEIGHT).
     */
    private static class OutOfBoundsObject implements SpaceObject {
        @Override
        public int getX() {
            return 0;
        }

        @Override
        public int getY() {
            return 21;  // Out of bounds (assuming GAME_HEIGHT is 20)
        }

        @Override
        public void tick(int tick) {
            // No-op
        }

        @Override
        public game.ui.ObjectGraphic render() {
            return null;
        }
    }

    @Before
    public void setUp() {
        // Create a GameModel with dummy logger and player stats tracker
        model = new GameModel(msg -> {
        }, new PlayerStatsTracker());
    }

    /**
     * Test that objects outside the game area are removed during updateGame().
     */
    @Test
    public void testUpdateGame_removesOutOfBoundsObject() {
        model.addObject(new OutOfBoundsObject());  // Add object outside bounds
        assertEquals(1, model.getSpaceObjects().size());  // Confirm added

        model.updateGame(1);  // Run one game tick

        assertEquals(0, model.getSpaceObjects().size());  // Should be removed
    }

    /**
     * Test that objects within game boundaries are retained during updateGame().
     */
    @Test
    public void testUpdateGame_keepsInBoundsObject() {
        // Create an in-bounds space object
        SpaceObject inBoundsObject = new SpaceObject() {
            @Override
            public int getX() {
                return 5;
            }

            @Override
            public int getY() {
                return 10;
            }

            @Override
            public void tick(int tick) {
                // No-op
            }

            @Override
            public game.ui.ObjectGraphic render() {
                return null;
            }
        };

        model.addObject(inBoundsObject);  // Add to game model
        model.updateGame(1);              // Run one game tick

        assertEquals(1, model.getSpaceObjects().size());  // Should still be there
    }
}
