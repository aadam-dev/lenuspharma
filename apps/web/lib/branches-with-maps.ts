/**
 * Canonical branch data with map embeds. Used by homepage BranchLocator
 * and branches page so map locations are consistent and real (no placeholders).
 */
export const BRANCHES_WITH_MAPS = [
  {
    id: "lakeside",
    name: "Lakeside Branch",
    shortLabel: "Lakeside Estates",
    address: "Lakeside Estates, Community 8, Accra",
    phone: "0548325792",
    gps: "GD-123-4567",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.0632026975336!2d-0.13662022472317628!3d5.704009494277812!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9111816d05c5%3A0xce003f4dd9a1f7c!2sLenus%20Pharmacy--%20Lakeside%20branch!5e0!3m2!1sen!2sus!4v1769984762137!5m2!1sen!2sus",
  },
  {
    id: "botwe",
    name: "Ashaley Botwe Branch",
    shortLabel: "Botwe 3rd Gate",
    address: "Botwe 3rd Gate, Ashaley Botwe, Accra",
    phone: "0548325792",
    gps: "GD-234-5678",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.2166383287454!2d-0.1528869247233423!3d5.681796894299815!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9cd347305547%3A0xf830ee2aa06655b!2sLenus%20Pharmacy%20-%20Ashalley%20Botwe%20Branch!5e0!3m2!1sen!2sus!4v1769984798410!5m2!1sen!2sus",
  },
  {
    id: "madina",
    name: "Madina Branch",
    shortLabel: "Madina",
    address: "Madina, Accra, Ghana",
    phone: "0548325792",
    gps: "GD-345-6789",
    mapEmbed:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.258356869943!2d-0.16258362472335466!3d5.675742394305817!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9d3fd88f0469%3A0x16a244207ae445b9!2sLenus%20Pharmacy-%20Madina%20Branch!5e0!3m2!1sen!2sus!4v1769984841648!5m2!1sen!2sus",
  },
] as const;
