import game.GameModel;
import game.achievements.PlayerStatsTracker;
import game.core.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.*;

public class GameModelCheckCollisionsTest {

    private GameModel model;
    private Ship ship;

    @Before
    public void setUp() {
        model = new GameModel(System.out::println, new PlayerStatsTracker());
        ship = model.getShip();
    }

    @After
    public void tearDown() {
        model = null;
        ship = null;
    }

    @Test
    public void testShipCollidesWithHealthPowerUp() {
        ship.takeDamage(50);
        HealthPowerUp powerUp = new HealthPowerUp(ship.getX(), ship.getY());
        model.addObject(powerUp);

        model.checkCollisions();

        assertEquals("Ship should be healed by 20", 70, ship.getHealth());
        assertFalse("PowerUp should be removed", model.getSpaceObjects().contains(powerUp));
    }

    @Test
    public void testBulletHitsEnemyRemovesBoth() {
        Enemy enemy = new Enemy(2, 2);
        Bullet bullet = new Bullet(2, 2);
        model.addObject(enemy);
        model.addObject(bullet);

        model.checkCollisions();

        assertFalse("Enemy should be removed", model.getSpaceObjects().contains(enemy));
        assertFalse("Bullet should be removed", model.getSpaceObjects().contains(bullet));
    }

    @Test
    public void testBulletHitsAsteroidRemovesOnlyBullet() {
        Asteroid asteroid = new Asteroid(4, 4);
        Bullet bullet = new Bullet(4, 4);
        model.addObject(asteroid);
        model.addObject(bullet);

        model.checkCollisions();

        assertTrue("Asteroid should remain", model.getSpaceObjects().contains(asteroid));
        assertFalse("Bullet should be removed", model.getSpaceObjects().contains(bullet));
    }
}
