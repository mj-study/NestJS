import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { BoardStatus } from './board-status.enum';
import { User } from '../auth/user.entity';

@Injectable()
export class BoardsService {
  constructor(private boardsRepository: BoardRepository) {}

  createBoard(createBoardDto: CreateBoardDto, user: User): Promise<Board> {
    return this.boardsRepository.createBoard(createBoardDto, user);
  }

  getAllBoards() {
    return this.boardsRepository.getAllBoards();
  }

  getAllMyBoards(user: User): Promise<Board[]> {
    return this.boardsRepository.getAllMyBoards(user);
  }

  getBoardById(id: number): Promise<Board> {
    const board = this.boardsRepository.getBoardById(id);

    if (!board) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }

    return board;
  }

  updateBoard(id: number, status: BoardStatus): Promise<Board> {
    return this.boardsRepository.updateBoardStatus(id, status);
  }

  deleteBoard(id: number, user: User): void {
    this.boardsRepository.delete({ id, user }).then((result) => {
      if (result.affected === 0) {
        throw new NotFoundException(`Can't find Board with id ${id}`);
      }
    });
  }
}
