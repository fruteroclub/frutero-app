import React from 'react'
import CustomersPartnersCarousel from './customers-partners-carousel'

export default function CustomersPartnersSection() {
  return (
    <div className="page py-12">
      <div className="container gap-y-2">
        <div className="space-y-2 text-center">
          <h2 className="text-3xl font-normal text-foreground md:text-4xl">
            Respaldados por los mejores del ecosistema
          </h2>
        </div>
      </div>
      <CustomersPartnersCarousel />
    </div>
  )
}
