import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
//import { GqlContextType } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class RequestResponseTransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    // if (
    //   context.getType<GqlContextType>() === 'graphql' ||
    //   context.getHandler().name === 'main'
    // ) {
    //   return next.handle();
    // }
    //in case of http or rest api
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: context.switchToHttp().getResponse().statusMessage || '',
        data: data,
      })),
    );
  }
}
