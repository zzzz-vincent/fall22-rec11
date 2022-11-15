import { GameFramework } from '../core/framework'
import { GamePlugin } from '../core/gameplugin'

/**
 * An instance of this class represents a move (rock, paper, or scissors) in a rock-paper-scissors game.
 *
 * This also contains several convenience methods for determining the winner of two moves and for
 * playing rock-paper-scissors against a computer opponent.
 */

enum State { ROCK, PAPER, SCISSORS }
const stateCount = Object.keys(State).length

/** Represents a result of a rock-paper-scissors game between two players. */
enum Result { WIN, LOSE, TIE }

/**
 * Returns the winner of this rock-paper-scissors move played against the given opponent's move.
 *
 * @throws NullPointerException if {@code opponent} is null.
 */
function winner (thisState: State, opponentState: State): Result {
  if (thisState === opponentState) return Result.TIE
  if (((thisState + 1) % stateCount) === opponentState) return Result.LOSE
  return Result.WIN
}

/**
 *  Returns a uniformly random rock-paper-scissors move, for use in simulating a game against a
 * computer opponent.
 */
function randomMove (): State {
  return Math.floor(Math.random() * stateCount)
}

/**
 * Returns the result of the given move played against a uniformly random rock-paper-scissors move,
 * for use in playing a game against a computer opponent.
 */
function play (move: State): Result {
  return winner(move, randomMove())
}

// TODO: Implement the plugin
//
// function init (): GamePlugin {
//     throw new Error("not yet implemented")
// }
//
// export { init }
