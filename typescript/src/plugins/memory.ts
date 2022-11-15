import { GameFramework } from '../core/framework'
import { GamePlugin } from '../core/gameplugin'

const WIDTH = 4
const HEIGHT = 4
const WORDS = ['Apple', 'Boat', 'Car', 'Dog', 'Eagle', 'Fish', 'Giraffe', 'Helicopter']

const GAME_NAME = 'Memory'
const UNKNOWN_SQUARE_STRING = '?'
const BLANK_SQUARE_STRING = ''
const SELECT_FIRST_CARD_MSG = 'Select first card.'
const SELECT_SECOND_CARD_MSG = 'Select second card.'
const MATCH_FOUND_MSG = 'You found a match!  Select first card.'
const NOT_A_MATCH_MSG = 'That was not a match.  Select first card.'
const PLAYER_WON_MSG = 'Player %d won!'
const PLAYERS_TIED_MSG = 'Players %s tied.'

function shuffle<T> (array: T[]): T[] {
  let currentIndex = array.length; let randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]]
  }

  return array
}

/**
  * Constructs a new memory game with the given number of players and list of board items.  The game board
  * will consist of two copies of each item in the given list, accessed with 0-indexed positions.  A typical
  * client will construct a new game and then call {@code selectMatch} repeatedly until the game is over.
  *
  * @throws Error if numberOfPlayers < 1.
  */
class Memory<T> {
  readonly #board: Array<T | null>
  readonly numberOfPlayers: number
  readonly #scores: number[]
  currentPlayer: number
  constructor (numberOfPlayers: number, items: T[]) {
    if (numberOfPlayers < 1) {
      throw new Error(`Number of players must be positive: ${numberOfPlayers}`)
    }

    this.#board = items.slice()
    for (const i of items) { this.#board.push(i) }
    shuffle(this.#board)
    this.numberOfPlayers = numberOfPlayers
    this.#scores = new Array(numberOfPlayers).fill(0)
    this.currentPlayer = 0
  }

  /**
  * Returns true if the board has an item at the given position, and false otherwise.
  *
  * @throws IndexOutOfBoundsException if index < 0 or index >= the initial board size.
  */
  itemAt (index: number): T | null { return this.#board[index] }

  /**
     * Returns true if the board has an item at the given position, and false otherwise.
     *
     * @throws IndexOutOfBoundsException if index < 0 or index >= the initial board size.
     */
  hasItemAt (index: number): boolean { return this.itemAt(index) !== null }

  /**
     * Returns the current score for a given player number.
     *
     * @throws IndexOutOfBoundsException if playerNumber < 0 or >= numberOfPlayers()
     */
  scoreForPlayer (playerNumber: number): number {
    return this.#scores[playerNumber]
  }

  /**
     * Returns true if the game is over, and false otherwise.  The game is over if all items have been matched
     * from the board.
     */
  isOver (): boolean {
    for (const i of this.#board) {
      if (i !== null) { return false }
    }
    return true
  }

  /**
     * Returns the current leaders of the game, as a list of their player numbers.  If the game is over, the
     * returned leaders are the game winners (possibly a tie).
     */
  leaders (): number[] {
    const maxScore = Math.max(...this.#scores)
    const result = []
    for (let i = 0; i < this.numberOfPlayers; i++) {
      if (this.#scores[i] === maxScore) {
        result.push(i)
      }
    }
    return result
  }

  /**
     * Implements a move in a memory game, with the current player selecting two positions ({@code first} and
     * {@code second}) on the board as a proposed match.
     *
     * If the selected items are a match, removes the items from the board, increments the current player's score,
     * and the current player continues their turn.  If the selected items are not a match, simply advances to the
     * next player's turn.
     *
     * @param first The 0-indexed position of the first item selected on the board
     * @param second The 0-indexed position of the second item selected on the board
     * @return true if the selected positions are a match, and false otherwise
     */
  selectMatch (first: number, second: number): boolean {
    const firstItem: T = this.validateItemAt(first)
    const secondItem: T = this.validateItemAt(second)
    if (firstItem !== secondItem) { // Player selected mis-matched items; advance to next player
      this.currentPlayer = (this.currentPlayer + 1) % this.numberOfPlayers
      return false
    }

    this.#board[first] = null // Player selected matched items; remove items from board,
    this.#board[second] = null // increment score, and same player continues their turn
    this.#scores[this.currentPlayer]++
    return true
  }

  validateItemAt (index: number): T {
    const result = this.itemAt(index)
    if (result === null) {
      throw new Error(`Player selected empty position: ${index}`)
    }
    return result
  }
}

// TODO: Implement the plugin
//
// function init (): GamePlugin {
//     throw new Error("not yet implemented")
// }
//
// export { init }
