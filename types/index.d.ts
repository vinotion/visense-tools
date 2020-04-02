declare module "visense-tools" {
    interface Credentials {
        username: string;
        password: string;
    }

    interface SocketAddress {
        ip: string;
        port: number;
    }

    class Authentication {
        constructor(socketAddress: SocketAddress, useSsl: boolean);

        signIn(credentials: Credentials): Promise<void>;
        signOut(): Promise<void>;
        verify(): Promise<boolean>;

        getSessionToken(): string;
        setSessionToken(sessionToken: string): void;
    }

    class ConfigurationAdapter {
        constructor(socketAddress: SocketAddress, useSsl: boolean, sessionToken: string);

        getParameter(name: string): Promise<string>;
        setParameter(name: string, value: string): Promise<string>;

        getSignal(name: string): Promise<string>;

        setSlot(name: string, value: string): Promise<string>;
    }

    class ViSenseSystem {
        constructor(socketAddress: SocketAddress, useSsl: boolean, sessionToken: string, id: string);

        getId(): string;
        getProductName(): Promise<string>;
        getServiceTag(): Promise<string>;
        getConnectionStatus(): Promise<string>;
    }


    class WebSocketConnection {
        constructor(socketAddress: SocketAddress, useSsl: boolean, apiPath: string, sessionToken: string);

        open(): Promise<void>;
        close(): Promise<void>;

        send(query: string, onDataCallback: (data: any|null) => boolean, timeout: number): Promise<void>;
        send(query: string, onDataCallback: (data: any|null) => boolean): Promise<void>;
    }
}
