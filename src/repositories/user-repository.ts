export abstract class UserRepository{
    abstract create(
        name : string,
        cpf : string,
        email : string,
        phoneNumber : string
    ) : Promise<void>;

    abstract login(
        email : string,
    ) : Promise<{ id: string; name: string; cpf: string; phoneNumber: string; email: string; } | null>;
}