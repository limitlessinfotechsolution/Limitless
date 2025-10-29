import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Award,
  TrendingUp
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Image from 'next/image';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  status: 'active' | 'away' | 'offline';
  performance?: number;
  projects?: number;
  joinDate: string;
}

interface TeamProps {
  team: TeamMember[];
  onMemberClick?: (member: TeamMember) => void;
  className?: string;
}

const Team: React.FC<TeamProps> = ({
  team,
  onMemberClick,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTeam = team.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.role.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'away':
        return 'Away';
      default:
        return 'Offline';
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Team Members</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage your team and track performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-accent focus:border-accent"
            />
          </div>
          <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
            Filter
          </Button>
          <Button variant="primary" size="sm">
            Add Member
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <Users className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Members</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{team.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
              <User className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Active</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {team.filter(m => m.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Performance</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {team.length > 0
                  ? Math.round(team.reduce((sum, m) => sum + (m.performance || 0), 0) / team.length)
                  : 0}%
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
              <Award className="w-5 h-5" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">Projects</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                {team.reduce((sum, m) => sum + (m.projects || 0), 0)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-enterprise transition-all duration-300"
          >
            <div
              className="p-5 cursor-pointer"
              onClick={() => onMemberClick && onMemberClick(member)}
            >
              <div className="flex items-start">
                {member.avatar ? (
                  <div className="relative w-16 h-16 rounded-full">
                    <Image
                      src={member.avatar}
                      alt={member.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                  </div>
                )}
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {member.name}
                    </h3>
                    <div className="relative">
                      <Button variant="ghost" size="sm" icon={<MoreHorizontal className="w-4 h-4" />}>
                        &nbsp;
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {member.role}
                  </p>
                  <div className="flex items-center mt-2">
                    <span className={`w-3 h-3 rounded-full ${getStatusColor(member.status)} mr-2`}></span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {getStatusText(member.status)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between text-sm">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{member.email}</span>
                  </div>
                </div>

                {member.phone && (
                  <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 mr-2" />
                    <span>{member.phone}</span>
                  </div>
                )}

                {member.location && (
                  <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{member.location}</span>
                  </div>
                )}

                <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>Joined {member.joinDate}</span>
                </div>
              </div>
            </div>

            {member.performance !== undefined && (
              <div className="px-5 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Performance
                  </span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {member.performance}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-accent h-2 rounded-full"
                    style={{ width: `${member.performance}%` }}
                  ></div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {filteredTeam.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            No team members found
          </h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </Card>
  );
};

export default Team;

