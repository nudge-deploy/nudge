import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import NudgeRecommendation from "@/components/nudge-recommendation.tsx";
import useViewModel from "./BerandaPageViewModel.ts"
import {TransactionHistoryCard} from "@/components/transaction-history-card.tsx";
import {useUser} from "@/presentation/context/UserContext.tsx";
import {formatCurrency} from "@/lib/utils.ts";

export const BerandaPage = () => {
    const {
        user
    } = useUser();
    const {
        transactions
    } = useViewModel();
    return (
        <>
            <Card className="bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300">
                <CardHeader>
                    <CardTitle className="text-base text-yellow-800">Total Saldo</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold mb-1 text-yellow-900">{formatCurrency(user?.balance ?? 0)}</div>
                    <div className="text-sm text-yellow-700">+2,5% dari bulan lalu</div>
                </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-4">
                    <p className="text-sm text-blue-800">
                        <strong>Disclaimer:</strong> Saldo yang ditampilkan dalam aplikasi ini bersifat fiktif dan hanya
                        digunakan
                        untuk keperluan penelitian serta simulasi model rekomendasi nudge. Saldo ini tidak mencerminkan
                        saldo
                        aktual pengguna. Dalam simulasi ini, saldo yang digunakan adalah sebesar Rp 300.000.
                    </p>
                </CardContent>
            </Card>

            <NudgeRecommendation card={{
                content: "Tingkatkan tabungan Anda dengan Deposito Berjangka. Dapatkan bunga hingga 5,5% per tahun!",
                label: "Buka Deposito"
            } as Card}/>

            <TransactionHistoryCard transactions={transactions}/>
        </>
    )
}