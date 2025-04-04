import {Database, Tables} from "@/core/supabase.ts";

type DB = Database["public"]["Tables"];

declare global {
    type User = Tables<'nudge_user'>;
    type InsertUser = DB["nudge_user"]["Insert"];
    type UpdateUser = DB["nudge_user"]["Update"];

    type UserConsent = Tables<'nudge_user_consent'>;
    type InsertUserConsent = DB["nudge_user_consent"]["Insert"];
    type UpdateUserConsent = DB["nudge_user_consent"]["Update"];

    type UserSurvey = Tables<'nudge_user_survey'>
    type InsertUserSurvey = DB["nudge_user_survey"]["Insert"];
    type UpdateUserSurvey = DB["nudge_user_survey"]["Update"];

    type UserConsentForm = Tables<'user_consent_form'>;
    type InsertUserConsentForm = DB["user_consent_form"]["Insert"];

    type UserFinishSurveys = Tables<'user_finish_surveys'>;
    type InsertUserFinishSurvey = DB["user_finish_surveys"]["Insert"];

    type Category = Tables<'nudge_category'>;

    type Product = Tables<'nudge_product'>;

    type UserTransaction = Tables<'nudge_user_transaction'>;
    type InsertUserTransaction = DB["nudge_user_transaction"]["Insert"];

    type UserTransactionWithDetails = UserTransaction & {
        nudge_product: Product & {
            nudge_category: Category
        }
    };

    type Card = Tables<'nudge_card'>;

    type FeedbackQuestion = Tables<'nudge_feedback_question'>;

    type FeedbackResponse = Tables<'nudge_feedback_response'>;
    type InsertFeedbackResponse = DB["nudge_feedback_response"]["Insert"];

    type FinishSimulation = Tables<'nudge_finish_simulation'>;
    type InsertFinishSimulation = DB["nudge_finish_simulation"]["Insert"];
    type UpdateFinishSimulation = DB["nudge_finish_simulation"]["Update"];

    type FinishAndResponses = FinishSimulation & {
        responses: FeedbackResponse[]
    }

    type CardInteraction = Tables<'nudge_card_interaction'>;
    type InsertCardInteraction = DB["nudge_card_interaction"]["Insert"];

    type CardCarousel = Tables<'nudge_card_carousel'>;

    type UserReward = Tables<'nudge_user_reward'>;
    type InsertUserReward = DB["nudge_user_reward"]["Insert"];

    type UserResponses = Tables<'user_responses'>;
    type InsertUserResponse = DB["user_responses"]["Insert"];

    type PublicUser = Tables<'users'>;
    type InsertPublicUser = DB["users"]["Insert"];

    type TransactionHistory = Tables<'transaction_history'>;
    type InsertTransactionHistory = DB["transaction_history"]["Insert"];

    type Records = Tables<'records'>

    type RecordCategory = Tables<'record_categories'>

    type TransactionHistoryWithDetails = TransactionHistory & {
        records: Records & {
            category: RecordCategory;
        }
    }
}