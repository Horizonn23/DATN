import FaqDropdownList, {
  FaqDropdownListProps,
} from "@/components/FaqDropdownList";
import React from "react";

const faqList: FaqDropdownListProps[] = [
  {
    title: "Return & Delivery",
    dropdownList: [
      {
        title: "Return Policy",
        description:
          "Shoot us an email at sugar_paws@gmail.com ! Please include your order number and the reason for the return in your message so we can best assist you.\nOur team will take 24-48 hours to respond. If you don't hear from us within this time frame, please reach out via social media as it's possible your message ended up in our spam folder!\nPlease understand that we only accept returns within 14 days of delivery",
      },
      {
        title: "Damaged Items",
        description:
          "Mistakes happen during shipping. Please send us a message at contact@lolitacollective.com with photos of the broken item and we will be happy to send you a refund or replacement.\nPlease understand that we only accept returns within 14 days of delivery.",
      },
      {
        title: "Missing Items",
        description:
          "Please let us know as we would like to help find a way to retrieve your missing items and solve why that issue occurred. ",
      },
      {
        title: "My item says delivered, but it's not here.",
        description:
          "This could happen for many different reasons and we would like to help. It is best to contact us so we can look into it on our end.\nPlease check in with both your local post office or neighbors as sometimes items get updated by mistake or get delivered to the house or apartment next to you.\nBeing a small business made of many independent designers, our sellers are not required to replace a stolen package. Theft is a crime and should be reported to the police. We will always reach out to our designers on your behalf, but we can not guarantee replacement from them if the item is marked as delivered.",
      },
      {
        title: "My item is being returned to sender.",
        description:
          "Please make sure that you have entered the right address when filling out your order. We do not cover lost or returned items that go missing caused by an incorrectly entered address.\nIf this occurs we will still try our best to locate and get your items to you. But additional shipping may occur from a return to sender and shipment back out to your location.",
      },
      {
        title: "How long will it take to receive my order?",
        description:
          "Processing time: typically 3 to 7 days.\nYour item may be made to order. Please check the listing for that indication.\nMany of our items ship directly from their manufacturers and take an additional 5 - 8 days to process.\nOnce shipped most domestic orders take anywhere from 2 to 10 business days to arrive depending on the efficiency of your local postal service.\nInternational shipping delivery times may vary between 2 and 12 weeks.",
      },
    ],
  },
  {
    title: "Shipping",
    dropdownList: [
      {
        title: "Where is my order coming from?",
        description:
          "Our items are handmade from all over the world. Some of our vendors have chosen to send their items to our warehouse. Those items ship within 3-12 days of purchase. Most warehouse-based items ship on Friday.\nSome items, both domestic and international, ship directly from our manufacturers and may be made to order. If the Item is handmade, it may take between 5-20+ days to make.\nPlease check the listing of the product for the shipping location. If you need an item faster, please make a note in your order and we will do our best to accommodate your request.\nGiven the COVID logistics delays, please allow between 7-45 days for transit from all locations. All shipments are affected. It has been a nightmare.",
      },
      {
        title: "Shipping Rates by Location",
        description:
          "Missouri, USA Warehouse - many small items ship from this location.\nUS shipping from this location starts at $4\nInternational shipping from this location starts at $15\nDomestic Vendors - in order to help our vendors sell on more channels without having stock held in our warehouse, we've switched to this option.\nUS shipping from this location starts at $4\nInternational shipping from this location starts at $15\nInternational Vendors\nOur system does not allow our international vendors to order postage directly, so we've included some postage in the item price.\nUS shipping from this location starts at $10\nInternational shipping from this location starts at $10\nPrint on Demand\nTo offer a wide range of sizes, we've partnered with print on demand services. Thankfully, our provider prices all international and domestic shipping at the same rate.\nAll Shipping from this location is $5.",
      },
      {
        title: "Countries We Ship To",
        description:
          "Currently, we ship to the United States, Canada, Australia, the UK and the EU. ",
      },
    ],
  },
  {
    title: "Items & Designers ",
    dropdownList: [
      {
        title: "Are you a consignment shop?",
        description:
          "Yes! Sugar Paws  is an authorized seller of independent Lolita and other Japanese street fashion style brands in the United States sellingboth online and in person at conventions. We take a commission on all of our sales, returning the majority of the sale back to the designer. Our brands are from all over the world including American, European and Asian brands!",
      },
      {
        title: "How do you select your items?",
        description:
          "Our vendors are allowed to send us any items they would like. We try to encourage our designers to send us items we believe will do best with our customers, but they are welcome to sell anything they would like.",
      },
      {
        title:
          "I see you sell Chinese (taobao) Brands, are you a taobao reseller?",
        description:
          "Any company worldwide can join the Collective on the same terms. If a seller is located in China and would like to join the Collective, we offer them the same terms we offer all other designers. Many Chinesedesigners also have their own stores on the Taobao marketplace. The designers set their own prices, not the Collective staff. If an itemseems more expensive, that is often because the price includes shipping directly from the vendor. ",
      },
      {
        title: "How can I send my items to be sold by the Collective?",
        description:
          "We accept new applications during January and June.\nFor more information, please drop us an e-mail at sugar_paws@gmail.com",
      },
    ],
  },
];

const page = () => {
  return (
    <main>
      <div className="w-full h-[140px] bg-custom-pink font-semibold text-[40px] flex items-center justify-center">
        FAQ’s
      </div>
      <div className="w-full flex flex-col justify-center items-center gap-16 pt-16 text-[12px]">
        <section className="w-[60%] max-w-[1200px] min-w-[928px] flex flex-col gap-20">
          {faqList.map((faq, index) => (
            <FaqDropdownList
              key={index}
              title={faq.title}
              dropdownList={faq.dropdownList}
            />
          ))}
        </section>
      </div>
    </main>
  );
};

export default page;
