import {
    FaWallet,
    FaShieldAlt,
    FaProjectDiagram,
    FaArrowUp,
    FaArrowDown
} from "react-icons/fa";

interface Props{

    account:any;

}

function AccountCard({

    account

}:Props){

    if(!account){

        return(

            <div className="bg-white rounded-3xl shadow border p-6">

                Loading...

            </div>

        );

    }

    return(

        <div className="bg-white rounded-3xl shadow-lg border p-6">

            <div className="flex items-center justify-between">

                <h2 className="text-xl font-bold">

                    👤 Account Intelligence

                </h2>

                <div className="text-blue-600">

                    <FaProjectDiagram size={22}/>

                </div>

            </div>

            <div className="mt-6 space-y-5">

                <div>

                    <p className="text-gray-500">

                        Account

                    </p>

                    <h3 className="font-bold text-lg">

                        {account.account_number}

                    </h3>

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div className="bg-slate-50 rounded-xl p-4">

                        <FaWallet/>

                        <p className="text-gray-500 text-sm mt-2">

                            Balance

                        </p>

                        <h3 className="font-bold">

                            ₹{Number(account.balance).toLocaleString()}

                        </h3>

                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">

                        <FaShieldAlt/>

                        <p className="text-gray-500 text-sm mt-2">

                            Trust

                        </p>

                        <h3 className="font-bold">

                            {account.trust_score}

                        </h3>

                    </div>

                </div>

                <div className="grid grid-cols-2 gap-4">

                    <div className="bg-green-50 rounded-xl p-4">

                        <FaArrowDown/>

                        <p className="text-sm text-gray-500">

                            Received

                        </p>

                        <h3 className="font-bold">

                            ₹{Number(account.total_received).toLocaleString()}

                        </h3>

                    </div>

                    <div className="bg-red-50 rounded-xl p-4">

                        <FaArrowUp/>

                        <p className="text-sm text-gray-500">

                            Sent

                        </p>

                        <h3 className="font-bold">

                            ₹{Number(account.total_sent).toLocaleString()}

                        </h3>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default AccountCard;