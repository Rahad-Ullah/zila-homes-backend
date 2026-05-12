// The Business Intent
export enum PropertyCategory {
    Listing = "listing",           // Buy/Rent
    Accommodation = "accommodation" // Short-term stay
}

// The Physical Structure
export enum PropertyStructureType {
    // Residential
    House = "house",
    Apartment = "apartment",
    Villa = "villa",
    Penthouse = "penthouse",

    // Commercial
    Office = "office",
    Shop = "shop",
    Warehouse = "warehouse",

    // Hospitality Specific
    Hotel = "hotel",
    Resort = "resort",
    GuestHouse = "guest_house",

    // Unique/Vacation
    Treehouse = "treehouse",
    Houseboat = "houseboat",
    Farmhouse = "farmhouse"
}

export enum PropertyStatus {
    Draft = 'draft',
    Active = 'active',
    Inactive = 'inactive',
    Closed = 'closed',
}