export type Cuenta = {
    id?: number | string; //cambiar por number cuando la logica db este lista
    userId: number | string; //cambiar por number cuando la logica db este lista
    userName: string;
    userEmail: string;
    serviceName: string;
    serviceUrl: string;
    servicePassword: string;
    serviceType: string;
    serviceDescription: string;
    created?: string
}