import {createContext, useContext, useState, ReactNode, useMemo, useCallback} from "react";
import {AuthResponse, User} from "@supabase/supabase-js";
import UserSupabaseDataSource from "@/data/datasource/supabase/UserSupabaseDataSource.ts";
import {UserRepositoryDataSource} from "@/data/repository/UserRepositoryDataSource.ts";
import {UserSignIn} from "@/domain/usecase/UserSignIn.ts";
import {UserSignUp} from "@/domain/usecase/UserSignUp.ts";
import {useToast} from "@/components/ui/use-toast.ts";

interface UserContextType {
    user: User | null;
    setUser: (value: (((prevState: (User | null)) => (User | null)) | User | null)) => void;
    balance: number;
    setBalance: (value: (((prevState: number) => number) | number)) => void;
    login: (email: string, password: string) => Promise<AuthResponse>;
    register: (email: string, password: string) => Promise<AuthResponse>;
    logout: () => void;
    incBalance: (amount: number) => number;
}

const UserContext = createContext<UserContextType>({
    user: null,
    setUser: () => {
    },
    balance: 0,
    setBalance: () => {
    },
    login: async () => Promise.reject(new Error("No UserProvider found")),
    register: async () => Promise.reject(new Error("No UserProvider found")),
    logout: () => {
    },
    incBalance: (amount: number) => amount
});

export function UserProvider({children}: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [balance, setBalance] = useState<number>(30000000);
    const {toast} = useToast();

    const userDataSource = useMemo(() => new UserSupabaseDataSource(), []);
    const userRepository = useMemo(() => new UserRepositoryDataSource(userDataSource), [userDataSource]);

    const userSignInUseCase = useMemo(() => new UserSignIn(userDataSource), [userRepository]);
    const userSignUpUseCase = useMemo(() => new UserSignUp(userRepository), [userRepository]);

    const userSignIn = useCallback(async (email: string, password: string) => {
        return await userSignInUseCase.invoke(email, password);
    }, [userSignInUseCase]);
    const userSignUp = useCallback(async (email: string, password: string) => {
        return await userSignUpUseCase.invoke(email, password);
    }, [userSignUpUseCase])

    async function login(email: string, password: string) {
        const res = await userSignIn(email, password);

        if (res.error) {
            toast({
                title: "Login failed!",
                description: `${res.error.message}`,
            });
        } else {
            toast({
                title: "Login success!",
                description: `Welcome, ${res.data.user?.email}!`,
            });
        }

        return res;
    }

    async function register(email: string, password: string) {
        const res = await userSignUp(email, password);

        if (res.error) {
            toast({
                title: "Register failed!",
                description: `${res.error.message}`,
            });
        } else {
            toast({
                title: "Register success!",
                description: `Welcome, ${res.data.user?.email}!`,
            });
        }

        return res;
    }

    function logout() {
        setUser(null);
    }

    function incBalance(amount: number) {
        setBalance((prev) => prev + amount);
        return balance;
    }

    return (
        <UserContext.Provider value={{user, setUser, balance, setBalance, login, register, logout, incBalance}}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
}
