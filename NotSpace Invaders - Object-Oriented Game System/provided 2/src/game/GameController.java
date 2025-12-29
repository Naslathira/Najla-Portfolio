package game;

import game.achievements.Achievement;
import game.achievements.AchievementManager;
import game.achievements.PlayerStatsTracker;
import game.core.SpaceObject;
import game.exceptions.BoundaryExceededException;
import game.ui.UI;
import game.utility.Direction;

import java.util.ArrayList;
import java.util.List;

/**
 * The Controller handling the game flow and interactions.
 * <p>
 * Holds references to the UI and the Model, so it can pass information and references back and forth as necessary.<br>
 * Manages changes to the game, which are stored in the Model, and displayed by the UI.<br>
 */
public class GameController {
    private final long startTime;
    private final UI ui;
    private final GameModel model;
    private final AchievementManager achievementManager;

    /**
     * An internal variable indicating whether certain methods should log their actions.
     * Not all methods respect isVerbose.
     */
    private boolean isVerbose = false;
    private final PlayerStatsTracker statsTracker;
    /**
     * A flag that tracks whether the game is currently paused.
     */
    private boolean isPaused = false;


    /**
     * Initializes the game controller with the given UI, GameModel and AchievementManager.<br>
     * Stores the UI, GameModel, AchievementManager and start time.<br>
     * The start time System.currentTimeMillis() should be stored as a long.<br>
     * Starts the UI using UI.start().<br>
     * * Also stores the PlayerStatsTracker by retrieving it from the provided GameModel.<br>
     *
     * @param ui the UI used to draw the Game
     * @param model the model used to maintain game information
     * @param achievementManager the manager used to maintain achievement information
     *
     * @requires ui is not null
     * @requires model is not null
     * @requires achievementManager is not null
     * @provided
     */
    public GameController(UI ui, GameModel model, AchievementManager achievementManager) {
        this.ui = ui;
        ui.start();
        this.model = model;
        this.startTime = System.currentTimeMillis(); // Current time
        this.achievementManager = achievementManager;
        this.statsTracker = model.getStatsTracker();

    }


    /**
     * Initializes the game controller with the given UI and GameModel.<br>
     * Stores the ui, model and start time.<br>
     * The start time System.currentTimeMillis() should be stored as a long.<br>
     *
     * @param ui    the UI used to draw the Game
     * @param achievementManager the manager used to maintain achievement information
     *
     * @requires ui is not null
     * @requires achievementManager is not null
     * @provided
     */
    public GameController(UI ui, AchievementManager achievementManager) {
        this(ui, new GameModel(ui::log, new PlayerStatsTracker()), achievementManager);
    }

    /**
     * Returns the current GameModel.
     *
     * @return the current GameModel
     */
    public GameModel getModel() {
        return model;
    }

    /**
     * Returns the current PlayerStatsTracker.
     *
     * @return the current PlayerStatsTracker
     */
    public PlayerStatsTracker getStatsTracker() {
        return statsTracker;
    }

    /**
     * Sets verbose state to the provided input.
     * Also sets the model's verbose state to the provided input.
     *
     * @param verbose whether to set verbose state to true or false
     */
    public void setVerbose(boolean verbose) {
        this.isVerbose = verbose;
        model.setVerbose(verbose);
    }


    /**
     * Starts the main game loop.<br>
     * <p>
     * Passes onTick and handlePlayerInput to ui.onStep and ui.onKey respectively.
     * @provided
     */
    public void startGame() {
        ui.onStep(this::onTick);
        ui.onKey(this::handlePlayerInput);
    }

    /**
     * Uses the provided tick to call and advance the following:<br>
     * - A call to model.updateGame(tick) to advance the game by the given tick.<br>
     * - A call to model.checkCollisions() to handle game interactions.<br>
     * - A call to model.spawnObjects() to handle object creation.<br>
     * - A call to model.levelUp() to check and handle leveling.<br>
     * - A call to refreshAchievements(tick) to handle achievement updating.<br>
     * - A call to renderGame() to draw the current state of the game.<br>
     * @param tick the provided tick
     * @provided
     */
    public void onTick(int tick) {
        model.updateGame(tick); // Update GameObjects
        model.checkCollisions(); // Check for Collisions
        model.spawnObjects(); // Handles new spawns
        model.levelUp(); // Level up when score threshold is met
        refreshAchievements(tick); // Handle achievement updating.
        renderGame(); // Update Visual

        // Check game over
        if (model.checkGameOver()) {
            pauseGame();
            showGameOverWindow();
        }
    }

    /**
     * Updates the player's progress towards achievements on every game tick, and uses the AchievementManager
     * to track and update the player's achievements.
     * <p>
     * Progress is a double between 0.0 and 1.0, where 1.0 means mastery.
     * <p>
     * Achievement Progress Calculations:
     * <ul>
     *     <li>Survivor: survival time in seconds / 120. Mastery at 120 seconds.</li>
     *     <li>Enemy Exterminator: shots hit / 20. Mastery at 20 shots.</li>
     *     <li>Sharp Shooter:
     *         <ul>
     *             <li>If shots fired > 10: accuracy / 0.99 (max 1.0).</li>
     *             <li>If shots fired <= 10: progress = 0.</li>
     *         </ul>
     *     </li>
     * </ul>
     * The AchievementManager updates achievements accordingly. Additionally, every 100 ticks and if verbose
     * is true, logs the current progress to the UI.
     *
     * @param tick the current game tick
     */
    public void refreshAchievements(int tick) {
        // Calculate Survivor progress
        double survivorProgress = Math.min(statsTracker.getElapsedSeconds() / 120.0, 1.0);

        // Calculate Enemy Exterminator progress
        double exterminatorProgress = Math.min(statsTracker.getShotsHit() / 20.0, 1.0);

        // Calculate Sharp Shooter progress
        double sharpShooterProgress;
        if (statsTracker.getShotsFired() > 10) {
            sharpShooterProgress = Math.min(statsTracker.getAccuracy() / 0.99, 1.0);
        } else {
            sharpShooterProgress = 0.0;
        }

        // Update achievements using AchievementManager
        achievementManager.updateAchievement("Survivor", survivorProgress);
        achievementManager.updateAchievement("Enemy Exterminator", exterminatorProgress);
        achievementManager.updateAchievement("Sharp Shooter", sharpShooterProgress);

        // Store/log new mastered achievements
        achievementManager.logAchievementMastered();

        // Update UI statistics for each achievement's progress
        for (Achievement ach : achievementManager.getAchievements()) {
            ui.setAchievementProgressStat(ach.getName(), ach.getProgress());
        }

        // Log achievement progress every 100 ticks if verbose
        if (isVerbose && tick % 100 == 0) {
            ui.logAchievements(achievementManager.getAchievements());
        }
    }


    /**
     * Renders the current game state, including score, health, level, and survival time.
     * <p>
     * - Uses {@code ui.setStat()} to update the "Score", "Health", and "Level" appropriately with information from the model.
     * - Uses {@code ui.setStat()} to update "Time Survived" with the number of seconds since the game started.
     * - Renders all {@code SpaceObject}s (including the Ship, which is not part of {@code model.getSpaceObjects()})
     *   by passing a combined list to {@code ui.render()}.
     */
    public void renderGame() {
        // Update UI stats using values from the model.
        ui.setStat("Score", String.valueOf(model.getShip().getScore()));
        ui.setStat("Health", String.valueOf(model.getShip().getHealth()));
        ui.setStat("Level", String.valueOf(model.getLevel()));

        long timeSurvived = (System.currentTimeMillis() - startTime) / 1000;
        ui.setStat("Time Survived", timeSurvived + " seconds");

        // Render all SpaceObjects including the Ship.
        // Since the ship isn't stored in model.getSpaceObjects(), combine them.
        List<SpaceObject> objectsToRender = new ArrayList<>(model.getSpaceObjects());
        objectsToRender.add(model.getShip());
        ui.render(objectsToRender);
    }

    /**
     * Handles player input and performs actions such as moving the ship or firing bullets.
     * Uppercase and lowercase inputs are treated identically.
     * - For movement keys "W", "A", "S", and "D", moves the ship up, left, down, or right respectively,
     *   unless the game is paused. Logs the movement if verbose is true:
     *   "Ship moved to ({x}, {y})"
     * - For input "F", fires a bullet and records the shot fired.
     * - For input "P", toggles the pause state of the game.
     * - For all other inputs, logs:
     *   "Invalid input. Use W, A, S, D, F, or P."
     * <p>
     * When the game is paused, only the pause/unpause action is allowed; all other actions are ignored.
     *
     * @param input the player's input command.
     * @requires input is a single character.
     */
    public void handlePlayerInput(String input) {
        String command = input.toUpperCase();

        // When the game is paused, only un-pausing (input "P") is allowed.
        if (isPaused && !command.equals("P")) {
            return;
        }

        switch (command) {
            case "W":
                try {
                    model.getShip().move(Direction.UP);
                    if (isVerbose) {
                        ui.log("Ship moved to (" + model.getShip().getX() + ", "
                                + model.getShip().getY() + ")");
                    }
                } catch (BoundaryExceededException e) {
                    ui.log(e.getMessage());
                }
                break;
            case "A":
                try {
                    model.getShip().move(Direction.LEFT);
                    if (isVerbose) {
                        ui.log("Ship moved to (" + model.getShip().getX() + ", "
                                + model.getShip().getY() + ")");
                    }
                } catch (BoundaryExceededException e) {
                    ui.log(e.getMessage());
                }
                break;
            case "S":
                try {
                    model.getShip().move(Direction.DOWN);
                    if (isVerbose) {
                        ui.log("Ship moved to (" + model.getShip().getX() + ", "
                                + model.getShip().getY() + ")");
                    }
                } catch (BoundaryExceededException e) {
                    ui.log(e.getMessage());
                }
                break;
            case "D":
                try {
                    model.getShip().move(Direction.RIGHT);
                    if (isVerbose) {
                        ui.log("Ship moved to (" + model.getShip().getX() + ", "
                                + model.getShip().getY() + ")");
                    }
                } catch (BoundaryExceededException e) {
                    ui.log(e.getMessage());
                }
                break;
            case "F":
                model.fireBullet();
                statsTracker.recordShotFired(); //record shot fired
                break;
            case "P":
                pauseGame();
                break;
            default:
                ui.log("Invalid input. Use W, A, S, D, F, or P.");
                break;
        }
    }


    /**
     * Calls ui.pause() to pause the game until the method is called again.
     * Toggles the paused state: if the game is currently paused, unpauses it; if running, pauses it.
     * Logs "Game paused." or "Game unpaused." accordingly after calling ui.pause(),
     * irrespective of verbose state.
     */
    public void pauseGame() {
        ui.pause();  // Pauses/unpauses the game

        // Toggle the paused state
        isPaused = !isPaused;

        // Log the status
        if (isPaused) {
            ui.log("Game paused.");
        } else {
            ui.log("Game unpaused.");
        }
    }

    /**
     * Displays a Game Over window containing the player's final statistics and achievement
     * progress.<br>
     * <p>
     * This window includes:<br>
     * - Number of shots fired and shots hit<br>
     * - Number of Enemies destroyed<br>
     * - Survival time in seconds<br>
     * - Progress for each achievement, including name, description, completion percentage
     * and current tier<br>
     * @provided
     */
    private void showGameOverWindow() {

        // Create a new window to display game over stats.
        javax.swing.JFrame gameOverFrame = new javax.swing.JFrame("Game Over - Player Stats");
        gameOverFrame.setSize(400, 300);
        gameOverFrame.setLocationRelativeTo(null); // center on screen
        gameOverFrame.setDefaultCloseOperation(javax.swing.JFrame.DISPOSE_ON_CLOSE);


        StringBuilder sb = new StringBuilder();
        sb.append("Shots Fired: ").append(getStatsTracker().getShotsFired()).append("\n");
        sb.append("Shots Hit: ").append(getStatsTracker().getShotsHit()).append("\n");
        sb.append("Enemies Destroyed: ").append(getStatsTracker().getShotsHit()).append("\n");
        sb.append("Survival Time: ").append(getStatsTracker().getElapsedSeconds())
                .append(" seconds\n");


        List<Achievement> achievements = achievementManager.getAchievements();
        for (Achievement ach : achievements) {
            double progressPercent = ach.getProgress() * 100;
            sb.append(ach.getName())
                    .append(" - ")
                    .append(ach.getDescription())
                    .append(" (")
                    .append(String.format("%.0f%%", progressPercent))
                    .append(" complete, Tier: ")
                    .append(ach.getCurrentTier())
                    .append(")\n");
        }

        String statsText = sb.toString();

        // Create a text area to show stats.
        javax.swing.JTextArea statsArea = new javax.swing.JTextArea(statsText);
        statsArea.setEditable(false);
        statsArea.setFont(new java.awt.Font("Monospaced", java.awt.Font.PLAIN, 14));

        // Add the text area to a scroll pane (optional) and add it to the frame.
        javax.swing.JScrollPane scrollPane = new javax.swing.JScrollPane(statsArea);
        gameOverFrame.add(scrollPane);

        // Make the window visible.
        gameOverFrame.setVisible(true);
    }

}

