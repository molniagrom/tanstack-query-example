import {Link} from "@tanstack/react-router";
import {useMeQuery} from "../../api/use-me-query.ts";

export const CurrentUser = () => {

    const query = useMeQuery()

    if (!query.data) return <span>...</span>

    return (
        <div>
            <Link to="/my-playlists" activeOptions={{exact: true}}>
                {query.data!.login}
            </Link>
        </div>
    )
}
