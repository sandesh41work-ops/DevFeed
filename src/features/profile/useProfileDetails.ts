import { auth } from "../../shared/services/firebase"

export function useProfileDetails(){
    const currentUser = auth.currentUser;
    return currentUser;
}