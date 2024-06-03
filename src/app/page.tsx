import { PrismaClient } from '@prisma/client';
import Crypto from "@/components/Crypto";

const prisma = new PrismaClient();

import React from 'react';



export default async function Page() {
  let data: any;
  try {
    const crypto = await prisma.contact.findMany({});
    data = JSON.parse(JSON.stringify(crypto));
  } catch (error) {
    console.log(error);
  }

  
  return (
    <div>
      <Crypto data2={data} />
    </div>
  );
}
