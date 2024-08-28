import { trpc } from "../utils/trpc";
import { Center } from "./Center";
import { Loader } from "./Loader";
import { ReactNode } from "react";

interface AuthProps {
    children: ReactNode;
}

export const Auth = ({ children }: AuthProps) => {
    const userQuery = trpc.user.me.useQuery();
    
    if (userQuery.isLoading) {
        return <Loader />;
    }

    if (userQuery.isError) {
        return <Center>Not authorised to view this page.</Center>;
    }

    return <>{children}</>;
};
