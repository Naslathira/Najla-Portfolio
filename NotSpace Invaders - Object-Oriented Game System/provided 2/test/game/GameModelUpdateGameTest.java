import game.GameModel;
import game.achievements.PlayerStatsTracker;
import game.core.HealthPowerUp;
import game.core.SpaceObject;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

public class GameModelUpdateGameTest {

    private GameModel model;

    @Before
    public void setUp() {
        model = new GameModel(System.out::println, new PlayerStatsTracker());
    }

    @After
    public void tearDown() {
        model = null;
    }

    @Test
    public void testValidUpdateGameRemovesOutOfBoundsObject() {
        SpaceObject obj = new HealthPowerUp(2, GameModel.GAME_HEIGHT); // y out-of-bounds
        model.addObject(obj);

        model.updateGame(1);

        assertFalse(model.getSpaceObjects().contains(obj));
    }

    @Test
    public void testValidUpdateGameKeepsInBoundsObject() {
        SpaceObject obj = new HealthPowerUp(2, GameModel.GAME_HEIGHT - 1); // valid y
        model.addObject(obj);

        model.updateGame(1);

        assertTrue(model.getSpaceObjects().contains(obj));
    }
}
