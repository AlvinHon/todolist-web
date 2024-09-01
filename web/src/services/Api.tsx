import CreateRequest from "./requests/CreateRequest";
import DeleteRequest from "./requests/DeleteRequest";
import ReadRequest from "./requests/ReadRequest";
import UpdateRequest from "./requests/UpdateRequest";
import CreateResponse from "./responses/CreateResponse";
import DeleteResponse from "./responses/DeleteResponse";
import ExceptionResponse from "./responses/ExceptionResponse";
import ReadResponse from "./responses/ReadResponse";
import UpdateResponse from "./responses/UpdateResponse";
import CreateTodoItemActivity from "./activities/CreateTodoItemActivity";
import UpdateTodoItemActivity from "./activities/UpdateTodoItemActivity";
import DeleteTodoItemActivity from "./activities/DeleteTodoItemActivity";

class API {
    public static async create(request: CreateRequest): Promise<CreateResponse> {
        return API.post("create", JSON.stringify(request))
            .then((json) => new CreateResponse(json))
    }

    public static async read(request: ReadRequest): Promise<ReadResponse> {
        return API.post("read", JSON.stringify(request))
            .then((json) => new ReadResponse(json))
    }

    public static async update(request: UpdateRequest): Promise<UpdateResponse> {
        return API.post("update", JSON.stringify(request))
            .then((json) => new UpdateResponse(json))
    }

    public static async delete(request: DeleteRequest): Promise<DeleteResponse> {
        return API.post("delete", JSON.stringify(request))
            .then((json) => new DeleteResponse(json))
    }

    private static async post(path: string, body: string): Promise<any> {
        // prefix path with api defined in setupProxy.js
        return fetch("api/" + path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body
        }).then((response) => {
            if (!response.ok) {
                return response.json().then((json) => {
                    throw new ExceptionResponse(json)
                })
            }
            return response.json()
        })
    }
}

class Feed<T> {
    // Path to subcribe to the stomp broker
    subPath: string;
    fnNew: new (args: any) => T;

    constructor(fnNew: new (args: any) => T, subPath: string) {
        this.subPath = subPath;
        this.fnNew = fnNew;
    }

    public parseActivityMessageBody(body: string): T {
        return new this.fnNew(JSON.parse(body));
    }
}


class Feeds {
    static Create = new Feed(CreateTodoItemActivity, "/topic/feeds-create");
    static Update = new Feed(UpdateTodoItemActivity, "/topic/feeds-update");
    static Delete = new Feed(DeleteTodoItemActivity, "/topic/feeds-delete");
}


interface ActivityReceiver {
    onReceiveCreateActivity: (activity: CreateTodoItemActivity) => void;
    onReceiveUpdateActivity: (activity: UpdateTodoItemActivity) => void;
    onReceiveDeleteActivity: (activity: DeleteTodoItemActivity) => void;
}

namespace ActivityReceiver {
    export const empty = {
        onReceiveCreateActivity: () => { },
        onReceiveUpdateActivity: () => { },
        onReceiveDeleteActivity: () => { }
    }
}

export { API, Feeds, ActivityReceiver };
