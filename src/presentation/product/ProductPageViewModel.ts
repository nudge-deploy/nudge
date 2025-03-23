import {useCallback, useMemo} from "react";
import RecordSupabaseDataSource from "@/data/datasource/supabase/RecordSupabaseDataSource.ts";
import {RecordRepositoryDataSource} from "@/data/repository/RecordRepositoryDataSource.ts";
import {RecordGetByCategory} from "@/domain/usecase/RecordGetByCategory.ts";
import {RecordCategory} from "@/domain/interface/RecordCategory.ts";
import {useUser} from "@/presentation/context/UserContext.tsx";
import {useSupabaseQuery} from "@/lib/hook/UseSupabaseQuery.ts";
import {TransactionHistorySupabaseDataSource} from "@/data/datasource/supabase/TransactionHistorySupabaseDataSource.ts";
import {TransactionHistoryRepositoryDatasource} from "@/data/repository/TransactionHistoryRepositoryDatasource.ts";
import {TransactionHistoryInsert} from "@/domain/usecase/TransactionHistoryInsert.ts";
import {Record} from "@/domain/model/Record.ts";
import {ProductSupabaseDataSource} from "@/data/datasource/supabase/ProductSupabaseDataSource.ts";
import {ProductRepositoryDataSource} from "@/data/repository/ProductRepositoryDataSource.ts";
import {ProductRead} from "@/domain/usecase/product/ProductRead.ts";
import {data} from "autoprefixer";
import {ProductReadyByCategory} from "@/domain/usecase/product/ProductReadyByCategory.ts";
import {UserTransactionSupabaseDataSource} from "@/data/datasource/supabase/UserTransactionSupabaseDataSource.ts";
import {UserTransactionRepositoryDataSource} from "@/data/repository/UserTransactionRepositoryDataSource.ts";
import {UserTransactionCreate} from "@/domain/usecase/user_transaction/UserTransactionCreate.ts";

export default function ProductPageViewModel(categoryId: number) {
    const {
        user,
        incBalance
    } = useUser();

    const transactionHistoryDataSource = useMemo(() => new TransactionHistorySupabaseDataSource(), []);
    const transactionHistoryRepository = useMemo(() => new TransactionHistoryRepositoryDatasource(transactionHistoryDataSource), [transactionHistoryDataSource]);

    const productDataSource = useMemo(() => new ProductSupabaseDataSource(), []);
    const productRepository = useMemo(() => new ProductRepositoryDataSource(productDataSource), [productDataSource]);

    const userTransactionDataSource = useMemo(() => new UserTransactionSupabaseDataSource(), []);
    const userTransactionRepository = useMemo(() => new UserTransactionRepositoryDataSource(userTransactionDataSource), [userTransactionDataSource]);

    const transactionHistoryInsertUseCase = useMemo(() => new TransactionHistoryInsert(transactionHistoryRepository), [transactionHistoryRepository]);
    const insertTransactionHistory = useCallback(async (data: InsertTransactionHistory[]) => {
        return await transactionHistoryInsertUseCase.invoke(data);
    }, [transactionHistoryInsertUseCase])

    const productReadByCategoryUseCase = useMemo(() => new ProductReadyByCategory(productRepository), [productRepository]);
    const productRead = useCallback(async () => {
        return await productReadByCategoryUseCase.invoke(categoryId);
    }, [productReadByCategoryUseCase, categoryId]);
    const {
        data: products,
        error: productsError,
        loading: productsLoading,
        refetch: productsRefetch,
    } = useSupabaseQuery(productRead)

    const userTransactionCreateUseCase = useMemo(() => new UserTransactionCreate(userTransactionRepository), [userTransactionRepository]);
    const userTransactionCreate = useCallback(async (data: InsertUserTransaction) => {
        return await userTransactionCreateUseCase.invoke(data);
    }, [userTransactionCreateUseCase])

    function onPurchase(product: Product, win: boolean) {
        if(user === null) return;
        userTransactionCreate({
            nudge_user_id: user.id,
            nudge_product_id: product.id,
            win: win
        } as InsertUserTransaction)
        const res = 5000000 * (12.5 / 100);
        incBalance(win ? res : -res);
    }

    return {
        products,
        productsError,
        productsLoading,
        productsRefetch,
        onPurchase
    }
}