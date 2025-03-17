import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { getWallet } from "@/Api/User/walletApi.js";
import WalletComponent from './Wallet';

const WalletMain = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const queryParams = {
        transactionType: activeFilter, 
        limit: 5,
        currentPage: currentPage,
      };
      const data = await getWallet(queryParams);
      console.log(data)
      if(data.wallet){
        setWallet(data.wallet);
        setTotalPages(data.wallet.numberofPages || 1); 
      }
      
    } catch (error) {
      console.error('Error fetching wallet details:', error);
      message.error(error?.message || 'Failed to fetch wallet details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [currentPage, activeFilter]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading wallet...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <WalletComponent 
        wallet={wallet}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        totalPages={totalPages}
      />
    </div>
  );
};

export default WalletMain;
