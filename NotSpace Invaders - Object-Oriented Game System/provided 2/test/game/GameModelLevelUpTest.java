import game.GameModel;
import game.achievements.PlayerStatsTracker;
import game.core.Ship;
import game.utility.Logger;
import org.junit.Before;
import org.junit.After;
import org.junit.Test;

import static org.junit.Assert.*;

public class GameModelLevelUpTest {

    private GameModel model;
    private Ship ship;

    @Before
    public void setUp() {
        model = new GameModel(new Logger() {
            @Override
            public void log(String message) {
                // ignore logger for this test
            }
        }, new PlayerStatsTracker());

        ship = model.getShip();
    }

    @After
    public void tearDown() {
        model = null;
        ship = null;
    }

    @Test
    public void testLevelUpWhenScoreMeetsThreshold() {
        ship.addScore(GameModel.SCORE_THRESHOLD); // START_LEVEL = 1 → needs 100
        model.levelUp();
        assertEquals("Level should increase to 2", 2, model.getLevel());
    }

    @Test
    public void testNoLevelUpWhenScoreTooLow() {
        ship.addScore(GameModel.SCORE_THRESHOLD - 1); // 99 < 100
        model.levelUp();
        assertEquals("Level should remain 1", 1, model.getLevel());
    }
}
