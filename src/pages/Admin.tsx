
import React from "react";
import GuestTable from "@/components/GuestTable";
import Navbar from "@/components/Navbar";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Navbar />
      <section className="py-10">
        <GuestTable />
      </section>
    </div>
  );
};

export default Admin;
