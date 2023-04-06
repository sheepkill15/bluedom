import React, {useState, useEffect} from "react";
import Table from "react-bootstrap/Table";
import { API_BASEURL, sendGetRequest } from "../Api";
import QuestItem, {Quest} from "../components/Quest";

const Home = () => {

    const [quests, setQuests] = useState<Quest[]>([]);

    const fetchAllQuests = () => {
        sendGetRequest(`${API_BASEURL}/Quest`, {})
            .then((res) => res.json())
            .then(setQuests)
            .catch(console.log);
    }

    useEffect(fetchAllQuests, [])

    return (
        <Table variant="dark">
            <thead>
                <tr>

                <th>
                    Name of quest
                </th>
                <th>
                    Length of text
                </th>
                <th>
                    Reward
                </th>
                <th>
                    Required time to complete
                </th>
                <th>
                    Issued by
                </th>
                <th></th>
                </tr>
            </thead>
            <tbody>
                {quests.map((quest) => <QuestItem quest={quest} />)}
            </tbody>
        </Table>
    )
}

export default Home;