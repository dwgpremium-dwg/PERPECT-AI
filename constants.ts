import { Preset } from './types';

export const TEXT = {
  en: {
    appTitle: 'PERPECT AI',
    login: 'Login',
    username: 'Username',
    password: 'Password',
    adminPanel: 'Admin Panel',
    dashboard: 'Dashboard',
    logout: 'Logout',
    mainPrompt: 'Main Prompt',
    additionalPrompt: 'Additional Prompt (Refine)',
    imageStyle: 'Image Style (Main)',
    referenceImage: 'Reference Image',
    uploadRef: 'Upload Reference',
    generate: 'GENERATE',
    download: 'Download',
    upscale4k: 'Upscale 4K',
    reset: 'Reset to Original',
    newProject: 'New Project',
    users: 'Members',
    addUser: 'Add Member',
    expiration: 'Expiration',
    actions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    shareId: 'Share ID',
    changePass: 'Change Password',
    presets: 'Preset Prompts',
    loading: 'Generating...',
    uploadMain: 'Upload Image or Start Generating',
    undo: 'Undo',
    redo: 'Redo',
    rotateLeft: 'Rotate L',
    rotateRight: 'Rotate R',
    flip: 'Flip',
    noHistory: 'No changes to undo',
    limitReached: 'Undo limit reached (5)',
    projectReset: 'Project Reset',
    adminKeyWarning: 'Admin must assign a key or ensure global key is active.',
    processing: 'Processing...',
  },
  th: {
    appTitle: 'PERPECT AI',
    login: 'เข้าสู่ระบบ',
    username: 'ชื่อผู้ใช้งาน',
    password: 'รหัสผ่าน',
    adminPanel: 'จัดการระบบ',
    dashboard: 'หน้าหลัก',
    logout: 'ออกจากระบบ',
    mainPrompt: 'คำสั่งหลัก (Prompt)',
    additionalPrompt: 'คำสั่งเพิ่มเติม (แต่งรูปเพิ่ม)',
    imageStyle: 'สไตล์ภาพ (หลัก)',
    referenceImage: 'รูปภาพอ้างอิง',
    uploadRef: 'อัพโหลดอ้างอิง',
    generate: 'สร้างภาพ',
    download: 'ดาวน์โหลด',
    upscale4k: 'สร้างภาพ 4K',
    reset: 'รีเซ็ตกลับภาพแรก',
    newProject: 'สร้างโปรเจคใหม่',
    users: 'สมาชิก',
    addUser: 'เพิ่มสมาชิก',
    expiration: 'วันหมดอายุ',
    actions: 'จัดการ',
    active: 'ใช้งานได้',
    inactive: 'ระงับการใช้งาน',
    shareId: 'แชร์ไอดี',
    changePass: 'เปลี่ยนรหัส',
    presets: 'คำสั่งสำเร็จรูป',
    loading: 'กำลังประมวลผล...',
    uploadMain: 'อัพโหลดรูปภาพหรือเริ่มสร้าง',
    undo: 'ย้อนกลับ',
    redo: 'ทำซ้ำ',
    rotateLeft: 'หมุนซ้าย',
    rotateRight: 'หมุนขวา',
    flip: 'พลิกรูป',
    noHistory: 'ไม่มีการแก้ไขให้ย้อนกลับ',
    limitReached: 'ย้อนกลับได้สูงสุด 5 ครั้ง',
    projectReset: 'รีเซ็ตโปรเจคเรียบร้อย',
    adminKeyWarning: 'กรุณาติดต่อแอดมินเพื่อเปิดใช้งาน',
    processing: 'กำลังทำงาน...',
  }
};

export const STYLES = [
  { id: 'photo', label: { en: 'Photograph', th: 'ภาพถ่าย' }, prompt: 'Realistic photograph, cinematic lighting, 8k, highly detailed' },
  { id: 'anime', label: { en: 'Anime', th: 'ภาพอะนิเมะ' }, prompt: 'Anime style, 2D, cel shading, vibrant colors, clean lines' },
  { id: 'watercolor', label: { en: 'Watercolor', th: 'ภาพวาดสีน้ำ' }, prompt: 'Watercolor painting style, artistic, wet-on-wet technique, soft edges' },
  { id: 'pencil', label: { en: 'Pencil Sketch', th: 'ภาพลายเส้นดินสอ' }, prompt: 'Pencil sketch, graphite, monochrome, rough texture, hand drawn' },
  { id: 'colored_pencil', label: { en: 'Colored Pencil', th: 'ภาพลายเส้นสีไม้' }, prompt: 'Colored pencil drawing, textured paper, soft shading, artistic' },
  { id: 'marker', label: { en: 'Marker Art', th: 'ภาพลายเส้นสีเมจิก' }, prompt: 'Marker art, bold lines, copic marker style, vibrant ink' },
];

export const PRESETS: Preset[] = [
  {
    category: 'Modern / โมเดิร์น',
    items: [
      {
        title: 'Resort Residential (Dusk/Dawn)',
        prompt: 'ภาพถ่ายความละเอียดสูงของบริเวณรีสอร์ทหรือโครงการที่พักอาศัย (High-resolution photograph of a resort or residential project area) ในยามโพล้เพล้ (dusk) หรือช่วงฟ้าสาง (dawn) ท้องฟ้าเป็นสีฟ้าอมเทา มีเมฆบางๆ (blue-grey sky with wispy clouds) บรรยากาศเงียบสงบและสดชื่น สวนที่ได้รับการออกแบบและดูแลอย่างประณีต (Meticulously designed and maintained gardens) เต็มไปด้วยพันธุ์ไม้เขียวชอุ่ม (lush greenery) หลากหลายชนิด ทั้งต้นไม้ใหญ่ให้ร่มเงา (large shade trees), ต้นสน (pine trees), ไม้พุ่ม (shrubs), ไม้ดอกสีสันสดใส (colorful flowering plants), และพืชคลุมดิน (ground covers) ทางเดินเท้าคอนกรีตหรือปูหิน (concrete or stone walkways) ลัดเลาะผ่านสวน มีบ่อน้ำหรือสระว่ายน้ำ (water features or swimming pools) ที่มีน้ำใสสะอาดสะท้อนแสงท้องฟ้า ในฉากหลัง มีอาคารสไตล์โมเดิร์น (Modern architecture) หลากหลายรูปแบบ, อาจเป็นบ้านเดี่ยว (single-detached houses), วิลล่า (villas), หรืออาคารส่วนกลาง (clubhouse), ที่มีการผสมผสานวัสดุต่างๆ เช่น คอนกรีต, หิน, ไม้, และกระจก หน้าต่างบานใหญ่เปิดรับแสงธรรมชาติ (large windows letting in natural light) และมีการเปิดไฟส่องสว่างในบางจุดเพื่อสร้างบรรยากาศที่อบอุ่น (warm lighting used in some areas) ถนนภายในโครงการเป็นถนนลาดยางหรือคอนกรีต (asphalt or concrete roads) ที่สะอาดและเป็นระเบียบ โดยมีแสงไฟจากโคมไฟสนาม (garden lights) หรือไฟส่องอาคาร (building lights) สร้างความสว่างและมิติให้กับพื้นที่'
      },
      {
        title: 'Woodland Garden House',
        prompt: 'A photorealistic architectural photograph of a [Insert Building Type], nestled in a lush, mature woodland garden. A winding light-grey flagstone pathway leads through a vibrant green lawn towards the entrance. The foreground is filled with rich, textured landscaping including ferns, hostas, and low-growing shrubs. Tall, mature trees frame the scene, creating a natural canopy overhead. Soft, diffused natural daylight illuminates the exterior, while warm golden interior lights glow invitingly from the windows, creating a cozy and serene atmosphere. High resolution, 8k, sharp focus, harmonious with nature'
      },
      {
        title: 'Modern Minimal Interior',
        prompt: 'Modern minimal interior design, clean lines, bright lighting'
      },
      {
        title: 'Futuristic City',
        prompt: 'Futuristic cityscape with neon lights and flying cars'
      },
      {
        title: 'Modern Fashion',
        prompt: 'Sleek modern fashion photography, high contrast'
      },
      {
        title: 'Abstract Art',
        prompt: 'Abstract modern art style, geometric shapes'
      },
      {
        title: 'Architectural Viz',
        prompt: 'Contemporary architectural visualization, 8k resolution'
      }
    ]
  },
  {
    category: 'Night Scene / บรรยากาศตอนค่ำ',
    items: [
      {
        title: 'Modern Luxury Night',
        prompt: 'Night architectural photography, modern luxury home, warm interior lighting glowing through glass windows, dark blue twilight sky, exterior shot, 8k resolution, cinematic atmosphere'
      },
      {
        title: 'Cyberpunk City Night',
        prompt: 'Cityscape at night, vibrant neon lights, wet streets reflecting lights, futuristic cyberpunk style, high contrast, detailed textures'
      },
      {
        title: 'Forest Cabin Night',
        prompt: 'Cozy cabin in the forest at night, starry sky, warm light from windows, fire pit outside, magical atmosphere'
      },
      {
        title: 'Resort Pool Night',
        prompt: 'Luxury resort swimming pool at night, underwater lighting, ambient garden lights, romantic evening setting, photorealistic'
      }
    ]
  },
  {
    category: 'Pool Villa / พลูวิลล่า',
    items: [
      {
        title: 'Ocean View Infinity Pool',
        prompt: 'Luxury modern pool villa with infinity edge pool, overlooking a turquoise ocean, wooden deck, sun loungers, tropical palm trees, bright sunny day, architectural digest style'
      },
      {
        title: 'Balinese Tropical',
        prompt: 'Private tropical pool villa, balinese style architecture, thatched roof, lush green garden, crystal clear swimming pool, relaxing atmosphere, 8k resolution'
      },
      {
        title: 'Minimalist White',
        prompt: 'Minimalist white concrete pool villa, large glass sliding doors, seamless indoor-outdoor living, reflection of building in the pool, golden hour lighting'
      },
      {
        title: 'Twilight Pool Villa',
        prompt: 'Modern pool villa at twilight, interior lights on, blue hour sky, elegant outdoor furniture, fire pit, cinematic wide angle shot'
      }
    ]
  },
  {
    category: 'Landscape / ทิวทัศน์',
    items: [
      {
        title: 'Rice Field Villa',
        prompt: 'ท้องทุ่งนาสีเขียวมุมเบิร์ดอายวิว A stunning architectural photograph of a [Insert Building Type], situated in the middle of vast, vibrant green rice paddy fields. In the background, a majestic, layering mountain range stretches across the horizon under a bright blue sky with fluffy white clouds. A long, straight paved concrete driveway leads from the foreground gate towards the building, flanked by manicured green lawns and the rice fields. The scene is bathed in bright, clear natural sunlight. High contrast, vivid colors, photorealistic, 8k resolution, wide-angle shot, peaceful countryside atmosphere.'
      },
      {
        title: 'Modern House & Nature',
        prompt: 'ภาพถ่ายสถาปัตยกรรมบ้านโมเดิร์นสองชั้นที่มีดีไซน์โดดเด่น ผนังภายนอกผสมผสานวัสดุคอนกรีตเปลือยและโครงสร้างสีดำเข้ากับระแนงไม้ เพื่อสร้างความรู้สึกอบอุ่นและกลมกลืนกับธรรมชาติ มีบานกระจกใสขนาดใหญ่สูงจากพื้นจรดเพดานเปิดให้เห็นการตกแต่งภายในที่ทันสมัย ตัวบ้านตั้งอยู่ท่ามกลางภูมิทัศน์ธรรมชาติที่เขียวชอุ่ม ฉากหลังเป็นทิวเขาป่าทึบเช่นเดียวกับในภาพ image_5.png ด้านหน้ามีสระน้ำสะท้อนเงาอาคาร สนามหญ้าเรียบกว้าง และสวนไม้ดอกนานาพันธุ์ แสงแดดธรรมชาติยามเช้าส่องกระทบ สร้างบรรยากาศที่เงียบสงบและหรูหรา'
      },
      {
        title: 'Cinematic Resort (Blue Hour)',
        prompt: 'A cinematic, photorealistic architectural landscape photograph of a luxurious resort villa at twilight (Blue Hour). Foreground & Outdoor Living (Primary Focus): The foreground features a sleek, dark-tiled swimming pool with still water creating perfect, mirror-like reflections of the warm lights. A spacious wooden deck surrounds the pool. The outdoor living area includes built-in lounge seating with plush cushions, a dining area with a large parasol, and wide stone steps leading up to the residence. Lighting & Atmosphere: The scene is illuminated by a cozy, warm golden glow coming from numerous floor lanterns placed on the steps and pool edge, as well as the interior lighting. This warm light contrasts beautifully with the cool deep blue tones of the twilight sky. The mood is intimate, inviting, and expensive. The Architecture (Variable Element): Overlooking the pool deck is a wide, expansive luxury residence. (Note to AI: The architecture can be any style—Modern Tropical, Contemporary Flat Roof, or Classic Resort Style with a pitched roof—provided it features an open-concept design with massive sliding glass doors that are fully open, revealing a warm, illuminated interior). Background: The backdrop is a dense, lush green hillside covering the horizon, providing a natural and secluded setting.'
      },
      {
        title: 'Fantasy Forest',
        prompt: 'Fantasy forest with glowing mushrooms and magical fog'
      },
      {
        title: 'Sunset Cyber City',
        prompt: 'Sunset over a cyberpunk city, vibrant colors'
      },
      {
        title: 'Snowy Mountain',
        prompt: 'Realistic mountain range, snowy peaks, clear blue sky'
      }
    ]
  }
];