import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RawHeaders = createParamDecorator(
    (data, ctx: ExecutionContext) => {

        const req = ctx.switchToHttp().getRequest();
        console.log(req.rawHeaders);
        // const headers = req.
        return req.rawHeaders;
    }
)