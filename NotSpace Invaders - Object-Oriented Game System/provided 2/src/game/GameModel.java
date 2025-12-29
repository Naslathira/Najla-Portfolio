package game;


import game.achievements.PlayerStatsTracker;
import game.core.*;
import game.utility.Logger;
import game.core.SpaceObject;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Represents the game information and state. Stores and manipulates the game state.
 */
public class GameModel {
    public static final int GAME_HEIGHT = 20;
    public static final int GAME_WIDTH = 10;
    public static final int START_SPAWN_RATE = 2; // spawn rate (percentage chance per tick)
    public static final int SPAWN_RATE_INCREASE = 5; // Increase spawn rate by 5% per level
    public static final int START_LEVEL = 1; // Starting level value
    public static final int SCORE_THRESHOLD = 100; // Score threshold for leveling
    public static final int ASTEROID_DAMAGE = 10; // The amount of damage an asteroid deals
    public static final int ENEMY_DAMAGE = 20; // The amount of damage an enemy deals
    public static final double ENEMY_SPAWN_RATE = 0.5; // Percentage of asteroid spawn chance
    public static final double POWER_UP_SPAWN_RATE = 0.25; // Percentage of asteroid spawn chance

    private final Random random = new Random(); // ONLY USED IN this.spawnObjects()
    private final List<SpaceObject> spaceObjects; // List of all objects
    private final Ship ship; // Core.Ship starts at (5, 10) with 100 health
    private int lvl; // The current game level
    private int spawnRate; // The current game spawn rate
    private final Logger logger; //(change wrter into logger) The Logger reference used for logging.
    private final PlayerStatsTracker statsTracker;
    private boolean verbose = false;


    /**
     * Models a game, storing and modifying data relevant to the game.<br>
     * <p>
     * Logger argument should be a method reference to a .log method such as the UI.log method.<br>
     * Example: Model gameModel = new GameModel(ui::log)<br>
     * <p>
     * - Instantiates an empty list for storing all SpaceObjects (except the ship) that the model needs to track.<br>
     * - Instantiates the game level with the starting level value.<br>
     * - Instantiates the game spawn rate with the starting spawn rate.<br>
     * - Instantiates a new ship. (The ship should not be stored in the SpaceObjects list)<br>
     * - Stores reference to the given logger.<br>
     *
     * @param logger a functional interface for passing information between classes.
     */
    public GameModel(Logger logger, PlayerStatsTracker statsTracker) {
        spaceObjects = new ArrayList<>();
        lvl = START_LEVEL;
        spawnRate = START_SPAWN_RATE;
        ship = new Ship();
        this.logger = logger;
        this.statsTracker = statsTracker;
    }

    /**
     * Returns the ship instance in the game.
     *
     * @return the current ship instance.
     */
    public Ship getShip() {
        return ship;
    }

    /**
     * Returns a list of all SpaceObjects in the game.
     *
     * @return a list of all spaceObjects.
     */
    public List<SpaceObject> getSpaceObjects() {
        return spaceObjects;
    }

    /**
     * Returns the current level.
     *
     * @return the current level.
     */
    public int getLevel() {
        return lvl;
    }

    /**
     * Returns the current player stats tracker.
     *
     * @return the current player stats tracker
     */
    public PlayerStatsTracker getStatsTracker() {
        return statsTracker;
    }

    /**
     * Adds a SpaceObject to the game.<br>
     * <p>
     * Objects are considered part of the game only when they are tracked by the model.<br>
     *
     * @param object the SpaceObject to be added to the game.
     * @requires object != null.
     */
    public void addObject(SpaceObject object) {
        this.spaceObjects.add(object);
    }

    /**
     * Updates the game state by moving all objects and then removing off-screen objects.<br>
     * <p>
     * Objects should be moved by calling .tick(tick) on each object.<br>
     * Objects are considered off-screen if they are at y-coordinate &gt; GAME_HEIGHT.<br>
     *
     * @param tick the tick value passed through to the objects tick() method.
     */
    public void updateGame(int tick) {
        List<SpaceObject> toRemove = new ArrayList<>();
        for (SpaceObject obj : spaceObjects) {
            obj.tick(tick); // Move objects downward
            if (!isInBounds(obj)) { // Remove objects that move off-screen
                toRemove.add(obj);
            }
        }
        spaceObjects.removeAll(toRemove);
    }

    /**
     * Sets verbose state to the provided input.
     *
     * @param verbose whether to set verbose state to true or false
     */
    public void setVerbose(boolean verbose) {
        this.verbose = verbose;
    }

    /**
     * Spawns new objects (asteroids, enemies, and power-ups) at random positions.
     * Uses this.random to make EXACTLY 6 calls to random.nextInt() and 1 random.nextBoolean.
     * <p>
     * Random calls should be in the following order:<br>
     * 1. Check if an asteroid should spawn (random.nextInt(100) &lt; spawnRate)<br>
     * 2. If spawning an asteroid, spawn at x-coordinate = random.nextInt(GAME_WIDTH)<br>
     * 3. Check if an enemy should spawn (random.nextInt(100) &lt; spawnRate * ENEMY_SPAWN_RATE)<br>
     * 4. If spawning an enemy, spawn at x-coordinate = random.nextInt(GAME_WIDTH)<br>
     * 5. Check if a power-up should spawn (random.nextInt(100) &lt; spawnRate * POWER_UP_SPAWN_RATE)<br>
     * 6. If spawning a power-up, spawn at x-coordinate = random.nextInt(GAME_WIDTH)<br>
     * 7. If spawning a power-up, spawn a ShieldPowerUp if random.nextBoolean(), else a HealthPowerUp.<br>
     * <p>
     * Failure to match random calls correctly will result in failed tests.<br>
     * <p>
     * Objects spawn at y = 0 (top of the screen).<br>
     * Objects do not spawn if the spawn position is already occupied by the ship or another space object.<br>
     * This should NOT impact calls to random.<br>
     */
    public void spawnObjects() {
        // Spawn asteroids with a chance determined by spawnRate
        if (random.nextInt(100) < spawnRate) {
            int x = random.nextInt(GAME_WIDTH); // Random x-coordinate
            int y = 0; // Spawn at the top of the screen
            if (!isOccupied(x, y)) {
                spaceObjects.add(new Asteroid(x, y));
            }
        }

        // Spawn enemies with a lower chance
        // Half the rate of asteroids
        if (random.nextInt(100) < spawnRate * ENEMY_SPAWN_RATE) {
            int x = random.nextInt(GAME_WIDTH);
            int y = 0;
            if (!isOccupied(x, y)) {
                spaceObjects.add(new Enemy(x, y));
            }
        }

        // Spawn power-ups with an even lower chance
        // One-fourth the spawn rate of asteroids
        if (random.nextInt(100) < spawnRate * POWER_UP_SPAWN_RATE) {
            int x = random.nextInt(GAME_WIDTH);
            int y = 0;
            PowerUp powerUp = random.nextBoolean() ? new ShieldPowerUp(x, y) :
                    new HealthPowerUp(x, y);
            if (!isOccupied(x, y)) {
                spaceObjects.add(powerUp);
            }
        }
    }

    /**
     * Checks if a given position would collide with the ship.
     *
     * @param x the x-coordinate to check.
     * @param y the y-coordinate to check.
     * @return true if the position collides with the ship, false otherwise.
     */
    private boolean isCollidingWithShip(int x, int y) {
        return (ship.getX() == x) && (ship.getY() == y);
    }

    /**
     * Checks if the given position is occupied by the ship or any existing space object.<br>
     * <p>
     * This is used to prevent spawning new objects on top of the ship or other objects.<br>
     *
     * @param x the x-coordinate to check.
     * @param y the y-coordinate to check.
     * @return true if the position is occupied; false otherwise.
     */
    private boolean isOccupied(int x, int y) {
        // Check ship collision
        if (isCollidingWithShip(x, y)) {
            return true;
        }
        // Check space objects
        for (SpaceObject obj : spaceObjects) {
            if (obj.getX() == x && obj.getY() == y) {
                return true;
            }
        }
        return false;
    }


    /**
     * If level progression requirements are satisfied, levels up the game by
     * increasing the spawn rate and level number.<br>
     * <p>
     * To level up, the score must not be less than the current level multiplied by the score threshold.<br>
     * To increase the level, the spawn rate should increase by SPAWN_RATE_INCREASE, and the level number should increase by 1.<br>
     * <p>
     * If the level is increased and {@code verbose} is set to true, logs the following message:<br>
     * "Level Up! Welcome to Level {new level}. Spawn rate increased to {new spawn rate}%."<br>
     * <p>
     * @hint score is not stored in the GameModel.
     */
    public void levelUp() {
        if (ship.getScore() < lvl * SCORE_THRESHOLD) {
            return;
        }
        lvl++;
        spawnRate += SPAWN_RATE_INCREASE;
        if (verbose) {
            logger.log("Level Up! Welcome to Level " + lvl + ". Spawn rate increased to "
                    + spawnRate + "%.");
        }
    }

    /**
     * Fires a bullet from the ship's current position.<br>
     * <p>
     * Creates a new bullet at the coordinates the ship occupies.<br>
     * Logs "Core.Bullet fired!"<br>
     */
    public void fireBullet() {
        int bulletX = ship.getX();
        int bulletY = ship.getY(); // Core.Bullet starts just above the ship
        spaceObjects.add(new Bullet(bulletX, bulletY));
        if (verbose) {
            logger.log("Core.Bullet fired!"); //(removed in A2 javadocs)
        }
    }

    /**
     * Detects and handles collisions between spaceObjects (Ship and Bullet collisions).
     * Objects are considered to be colliding if they share x and y coordinates.
     * <p>
     * First checks ship collision:
     * - If the ship is colliding with a PowerUp, apply the effect and log "Power-up collected: {obj.render()}".
     * - If the ship is colliding with an Asteroid, apply damage and log "Hit by asteroid! Health reduced by {damage}."
     * - If the ship is colliding with an Enemy, apply damage and log "Hit by enemy! Health reduced by {damage}."
     * For any collisions with the ship, the colliding object is removed.
     * <p>
     * Then checks bullet collision:
     * - If a Bullet collides with an Enemy, remove both Bullet and Enemy, and record the hit.
     * - If a Bullet collides with an Asteroid, remove the Bullet only.
     *
     */
    public void checkCollisions() {
        List<SpaceObject> toRemove = new ArrayList<>();
        // Check collisions with the Ship
        for (SpaceObject obj : spaceObjects) {
            // Skip checking Ships (No ships should be in this list)
            if (obj instanceof Ship) {
                continue;
            }
            // Check Ship collision (except Bullets)
            if (isCollidingWithShip(obj.getX(), obj.getY()) && !(obj instanceof Bullet)) {
                shipCollision(obj); // Delegate to helper method
                toRemove.add(obj); // Remove object after collision
            }
        }
        //Check collisions with Bullets
        for (SpaceObject obj : spaceObjects) {
            // Check only Bullets
            if (!(obj instanceof Bullet)) {
                continue;
            }
            // Check Bullet collision with Enemy or Asteroid
            for (SpaceObject other : spaceObjects) {
                if (!(other instanceof Enemy || other instanceof Asteroid)) {
                    continue;
                }
                if ((obj.getX() == other.getX()) && (obj.getY() == other.getY())) {
                    bulletCollision(obj, other, toRemove); // Delegate to helper method
                    break;
                }
            }
        }

        spaceObjects.removeAll(toRemove); // Remove all collided objects
    }

    /**
     * Handles collision between the Ship and a given object.
     * Applies appropriate effects based on the object type and logs the event.
     *
     * @param obj     the object colliding with the Ship (PowerUp, Asteroid, or Enemy)
     */
    private void shipCollision(SpaceObject obj) {
        switch (obj) {
            case PowerUp powerUp -> {
                powerUp.applyEffect(ship);
                if (verbose) {
                    logger.log("Power-up collected: " + obj.render());
                }
            }

            case Asteroid asteroid -> {
                ship.takeDamage(ASTEROID_DAMAGE);
                if (verbose) {
                    logger.log("Hit by " + obj.render() + "! Health reduced by "
                            + ASTEROID_DAMAGE + ".");
                }
            }
            case Enemy enemy -> {
                ship.takeDamage(ENEMY_DAMAGE);
                if (verbose) {
                    logger.log("Hit by " + obj.render() + "! Health reduced by "
                            + ENEMY_DAMAGE + ".");
                }
            }
            default -> {
            }
        }
    }

    /**
     * Handles collision between a Bullet and its target.
     * If the target is an Enemy, removes both Bullet and Enemy and records a successful hit.
     * If the target is an Asteroid, removes only the Bullet.
     *
     * @param bullet      the Bullet object
     * @param target      the object that the Bullet collided with (Enemy or Asteroid)
     * @param toRemove    the list of objects to remove after processing collisions
     */
    private void bulletCollision(SpaceObject bullet, SpaceObject target,
                                 List<SpaceObject> toRemove) {
        if (target instanceof Enemy) {
            toRemove.add(bullet);
            toRemove.add(target);
            statsTracker.recordShotHit(); // only for Enemy
        } else if (target instanceof Asteroid) {
            toRemove.add(bullet); // only remove bullet
            // no logging, no statsTracker call
        }
    }

    /**
     * Sets the seed of the Random instance created in the constructor using .setSeed().<br>
     * <p>
     * This method should NEVER be called.
     *
     * @param seed to be set for the Random instance
     * @provided
     */
    public void setRandomSeed(int seed) {
        this.random.setSeed(seed);
    }

    /**
     * Checks if the game is over.
     * <p>
     * The game is considered over if the Ship's health is less than or equal to 0.
     * This method checks the current health of the Ship and returns true if the game is over,
     * or false if the game is still ongoing.
     *
     * @return true if the Ship's health is <= 0 (game over), false otherwise
     */
    public boolean checkGameOver() {
        return ship.getHealth() <= 0;
    }

    /**
     * Checks if the given SpaceObject is inside the game bounds.
     * <p>
     * The SpaceObject is considered outside the game boundaries if:
     * - x-coordinate >= GAME_WIDTH,
     * - y-coordinate >= GAME_HEIGHT,
     * - x-coordinate < 0, or
     * - y-coordinate < 0.
     *
     * @param spaceObject the SpaceObject to check (must not be null)
     * @return true if the SpaceObject is within bounds; false otherwise
     * @throws IllegalArgumentException if spaceObject is null
     */
    public static boolean isInBounds(SpaceObject spaceObject) {
        if (spaceObject == null) {
            throw new IllegalArgumentException("spaceObject must not be null");
        }
        int x = spaceObject.getX();
        int y = spaceObject.getY();

        return x >= 0 && x < GAME_WIDTH && y >= 0 && y < GAME_HEIGHT;
    }
}
