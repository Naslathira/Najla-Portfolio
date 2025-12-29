import game.GameModel;
import game.achievements.PlayerStatsTracker;
import game.core.Asteroid;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class GameModelSpawnObjectsTest {

    private GameModel model;

    @Before
    public void setUp() {
        model = new GameModel(System.out::println, new PlayerStatsTracker());
        model.setRandomSeed(13); // Deterministic seed for predictable spawns

        // Force spawnRate high enough to guarantee spawn
        model.getShip().addScore(1000);  // Enough to level up several times
        for (int i = 0; i < 10; i++) {
            model.levelUp();
        }
    }

    @After
    public void tearDown() {
        model = null;
    }

    @Test
    public void testSpawnObjectsAddsObjects() {
        int before = model.getSpaceObjects().size();

        model.spawnObjects();

        int after = model.getSpaceObjects().size();
        assertTrue("Should spawn at least one object", after > before);
    }

    @Test
    public void testSpawnDoesNotPlaceOnOccupiedTile() {
        // Manually block (1, 0)
        model.addObject(new Asteroid(1, 0));

        model.spawnObjects();

        long atOneZero = model.getSpaceObjects().stream()
                .filter(obj -> obj.getX() == 1 && obj.getY() == 0)
                .count();

        assertEquals("Only one object should be at (1, 0)", 1, atOneZero);
    }
}
