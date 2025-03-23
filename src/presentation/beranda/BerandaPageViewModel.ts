import {useCallback, useEffect, useMemo, useState} from "react";
import {TransactionHistorySupabaseDataSource} from "@/data/datasource/supabase/TransactionHistorySupabaseDataSource.ts";
import {TransactionHistoryRepositoryDatasource} from "@/data/repository/TransactionHistoryRepositoryDatasource.ts";
import {useUser} from "@/presentation/context/UserContext.tsx";
import {PostgrestError} from "@supabase/supabase-js";
import {BaseSupabaseResponse} from "@/domain/model/response/BaseSupabaseResponse.ts";
import {TransactionHistoryGetWithDetails} from "@/domain/usecase/TransactionHistoryGetWithDetails.ts";
import {UserTransactionSupabaseDataSource} from "@/data/datasource/supabase/UserTransactionSupabaseDataSource.ts";
import {UserTransactionRepositoryDataSource} from "@/data/repository/UserTransactionRepositoryDataSource.ts";
import {UserTransactionReadByUser} from "@/domain/usecase/user_transaction/UserTransactionReadByUser.ts";

export default function BerandaPageViewModel() {
    const {
        user
    } = useUser();
    const [transactions, setTransactions] = useState<UserTransaction[]>([])

    const userTransactionDataSource = useMemo(() => new UserTransactionSupabaseDataSource(), []);
    const userTransactionRepository = useMemo(() => new UserTransactionRepositoryDataSource(userTransactionDataSource), [userTransactionDataSource]);

    const userTransactionReadByUserUseCase = useMemo(() => new UserTransactionReadByUser(userTransactionRepository), [userTransactionRepository]);
    const userTransactionReadByUser = useCallback(async () => {
        if (user === null) {
            return {
                success: false,
                data: null,
                error: {message: "User is not logged in", details: "", hint: "", code: ""} as PostgrestError
            } as BaseSupabaseResponse<UserTransaction[]>;
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

    return {
        transactions
    }
}