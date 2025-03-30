import {useCallback, useEffect, useMemo, useState} from "react";
import {useUser} from "@/presentation/context/UserContext.tsx";
import {PostgrestError} from "@supabase/supabase-js";
import {BaseSupabaseResponse} from "@/domain/model/response/BaseSupabaseResponse.ts";
import {UserTransactionSupabaseDataSource} from "@/data/datasource/supabase/UserTransactionSupabaseDataSource.ts";
import {UserTransactionRepositoryDataSource} from "@/data/repository/UserTransactionRepositoryDataSource.ts";
import {UserTransactionReadByUser} from "@/domain/usecase/user_transaction/UserTransactionReadByUser.ts";
import {useNavigate} from "react-router";

export default function BerandaPageViewModel() {
    const {
        user
    } = useUser();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [transactions, setTransactions] = useState<UserTransactionWithDetails[]>([]);
    const navigate = useNavigate();

    const FEEDBACK = "/app/feedback";

    const userTransactionDataSource = useMemo(() => new UserTransactionSupabaseDataSource(), []);
    const userTransactionRepository = useMemo(() => new UserTransactionRepositoryDataSource(userTransactionDataSource), [userTransactionDataSource]);

    const userTransactionReadByUserUseCase = useMemo(() => new UserTransactionReadByUser(userTransactionRepository), [userTransactionRepository]);
    const userTransactionReadByUser = useCallback(async () => {
        if (user === null) {
            return {
                success: false,
                data: null,
                error: {message: "User is not logged in", details: "", hint: "", code: ""} as PostgrestError
            } as BaseSupabaseResponse<UserTransactionWithDetails[]>;
        }
        return await userTransactionReadByUserUseCase.invoke(user.id);
    }, [userTransactionReadByUserUseCase, user])

    useEffect(() => {
        if (user) {
            userTransactionReadByUser()
                .then((res) => {
                    if(res.data !== null) setTransactions(res.data)
                });
        }
    }, [user]);

    function handleFinish() {
        navigate(FEEDBACK, {replace: true});
    }

    return {
        transactions,
        showModal,
        setShowModal,
        handleFinish
    }
}