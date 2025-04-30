import React from "react";

const teamMembers = [
  {
    name: "John Doe",
    role: "Founder & CEO",
    image: "/founder.jpg",
    description: "John is a visionary entrepreneur with a passion for innovation and leadership.",
  },
  {
    name: "Jane Smith",
    role: "Director of Operations",
    image: "/founder.jpg",
    description: "Jane ensures smooth business operations and efficient management strategies.",
  },
  {
    name: "Michael Brown",
    role: "Chief Technology Officer",
    image: "/founder.jpg",
    description: "Michael leads the tech team, ensuring cutting-edge solutions and security.",
  },
];

const AboutCard = () => {
  return (
    <div className="max-w-6xl mx-auto py-12">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-13">Meet Our Leadership</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map((member, index) => (
          <div 
            key={index} 
            className="bg-white shadow-lg rounded-lg p-6 text-center transition-transform duration-300 hover:scale-105"
          >
            <img 
              src={member.image} 
              alt={member.name} 
              className="w-28 h-28 mx-auto rounded-full object-cover shadow-md"
            />
            <h3 className="text-xl font-semibold mt-4 text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-500">{member.role}</p>
            <p className="text-gray-700 mt-3 text-sm">{member.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutCard;
