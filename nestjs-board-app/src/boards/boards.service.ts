import { Injectable, NotFoundException } from '@nestjs/common';
import { Board, BoardStatus } from './board.model';
import { v1 as uuid } from 'uuid';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardRepository } from './board.repository';

@Injectable()
export class BoardsService {
  constructor(private boardsRepository: BoardRepository) {}

  private boards: Board[] = [];

  createBoard(createBoardDto: CreateBoardDto): Board {
    const { title, description } = createBoardDto;

    const board: Board = {
      id: uuid(),
      title,
      description,
      status: BoardStatus.PUBLIC,
    };

    this.boards.push(board);
    return board;
  }

  getAllBoards(): Board[] {
    return this.boards;
  }

  getBoardById(id: string): Board {
    const found = this.boards.find((board) => board.id === id);
    if (!found) {
      throw new NotFoundException(`id: ${id} 게시물을 찾을 수 없습니다`);
    }

    return found;
  }

  updateBoardStatus(id: string, status: BoardStatus): Board {
    const board = this.getBoardById(id);
    board.status = status;
    return board;
  }

  deleteBoard(id: string): void {
    const found = this.getBoardById(id);
    this.boards = this.boards.filter((board) => board.id !== found.id);
  }
}
