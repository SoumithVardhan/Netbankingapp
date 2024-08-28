import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Center } from "./components/Center";
import { BankLogin } from "./components/BankLogin";
import { BankLogo } from "./components/BankLogo";
import { trpc } from "./utils/trpc";
import { Auth } from "./components/Auth";
import { Loader } from "./components/Loader";

type Bank = {
  id: number;
  bankName: string;
  placeholder: string;
  logo: string;
};

export function Banks() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
    }
  }, [searchParams]);

  const banks = trpc.bank.getBanks.useQuery<Bank[]>();
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);

  const handleBankSelect = (bank: Bank) => {
    setSelectedBank(bank);
  };

  if (banks.isLoading) {
    return <Loader />;
  }

  return (
    <Auth>
      <Center>
        <div className="flex flex-col gap-2 w-full sm:max-w-1/2 p-5">
          {selectedBank ? (
            <BankLogin bank={selectedBank} onClick={() => setSelectedBank(null)} />
          ) : (
            banks.data?.map((bank) => (
              <div className="border-t" key={bank.id}>
                <BankLogo bank={bank} onClick={() => handleBankSelect(bank)} />
              </div>
            ))
          )}
        </div>
      </Center>
    </Auth>
  );
}
