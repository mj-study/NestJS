import { Injectable, NotFoundException } from '@nestjs/common';
import { Board } from './board.entity';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';
import { BoardStatus } from './board-status.enum';

@Injectable()
export class BoardsService {
  constructor(private boardsRepository: BoardRepository) {}

  createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardsRepository.createBoard(createBoardDto);
  }

  getAllBoards() {
    return this.boardsRepository.getAllBoards();
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

  deleteBoard(id: number): void {
    this.boardsRepository.delete(id).then((result) => {
      if (result.affected === 0) {
        throw new NotFoundException(`Can't find Board with id ${id}`);
      }
    });
  }
}
