import {AuthResponse, PostgrestError, PostgrestResponse} from "@supabase/supabase-js";
import {InsertUserConsentForm} from "@/domain/model/request/InsertUserConsentForm.ts";
import {InsertUserFinishSurvey} from "@/domain/model/request/InsertUserFinishSurvey.ts";
import {BaseSupabaseResponse} from "@/domain/model/response/BaseSupabaseResponse.ts";

export interface UserRepository {

    signUp(email: string, password: string): Promise<AuthResponse>;

    signIn(email: string, password: string): Promise<AuthResponse>;

    checkConsent(userId: string): Promise<BaseSupabaseResponse<boolean>>;

    checkSurvey(userId: string): Promise<BaseSupabaseResponse<boolean>>;

    insertUserConsent(data: InsertUserConsentForm): Promise<UserConsentForm | PostgrestError>;

    insertUserFinishSurvey(data: InsertUserFinishSurvey): Promise<UserFinishSurveys | PostgrestError>;
}