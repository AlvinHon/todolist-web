A reverse proxy for Todo List Web in which the applications can be run in docker environment.

The following network architecture showing the components with their accessible ports.

```mermaid
graph TD;
      User-->Proxy[Proxy: 80];
      Proxy-->Server[Server: 8080];
      Proxy-->Web[Web: 3000];
      Server-->DB[mysql: 3306];
```