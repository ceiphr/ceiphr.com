import Image from 'next/image';
import { FunctionComponent, useEffect, useState } from 'react';

import { MarkGithubIcon as GitHubIcon } from '@primer/octicons-react';
import {
    FaLinkedin as LinkedInIcon,
    FaMastodon as MastodonIcon
} from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';

import Icon from '@components/ui/Icon';
import Tag from '@components/ui/Tag';
import { fetchProfile } from '@lib/fetch';

const Socials: FunctionComponent<{ socials: GitHubProfile['socials'] }> = ({
    socials
}) => {
    return <></>;
};

const Details: FunctionComponent<{ profile: GitHubProfile }> = ({
    profile
}) => {
    return <></>;
};

interface Props {
    className?: string;
}

const Profile: FunctionComponent<Props> = ({ className }) => {
    const [profile, setProfile] = useState<GitHubProfile>();

    useEffect(() => {
        fetchProfile()
            .then((profile: GitHubProfile) => {
                profile.socials.unshift({
                    provider: 'github',
                    url: profile.url
                });

                setProfile(profile);
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <div className={className}>
            <div className="flex items-center space-x-4">
                {profile?.avatar_url ? (
                    <Image
                        src={profile?.avatar_url ?? ''}
                        alt={profile?.name ?? ''}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full border border-gray-700"
                    />
                ) : (
                    <Skeleton
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full border border-gray-700"
                    />
                )}
                <div>
                    <h1 className="flex flex-row space-x-2">
                        <span className="text-xl font-bold">
                            {profile?.name ?? <Skeleton width={120} />}{' '}
                        </span>
                        <span>
                            <a
                                href={profile?.url ?? ''}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 text-lg hover:underline"
                            >
                                {profile?.username ? (
                                    <>@{profile.username}</>
                                ) : (
                                    <Skeleton width={70} />
                                )}
                            </a>
                        </span>
                    </h1>
                    <p className="leading-5 pt-1 text-gray-400">
                        {profile?.bio ? (
                            profile.bio
                        ) : (
                            <>
                                <Skeleton width={340} />
                                <Skeleton width={100} />
                            </>
                        )}
                    </p>
                </div>
            </div>
            <div className="flex flex-wrap gap-y-2 gap-x-1.5 pt-3 pr-8 text-gray-400">
                {profile?.location ? (
                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${profile?.location}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Tag>
                            <Icon name="location" className="inline-block" />
                            <span>{profile?.location}</span>
                        </Tag>
                    </a>
                ) : (
                    <Skeleton width={120} />
                )}
                {profile?.company ? (
                    <a
                        href={profile?.company.url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Tag>
                            <Icon name="work" className="inline-block" />
                            <span>{profile?.company.name}</span>
                        </Tag>
                    </a>
                ) : (
                    <Skeleton width={250} />
                )}
                {profile ? (
                    profile.socials.map((social) => (
                        <a
                            key={social.provider}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Tag>
                                {(() => {
                                    switch (social.provider) {
                                        case 'linkedin':
                                            return (
                                                <>
                                                    <LinkedInIcon className="inline-block" />
                                                    <span>LinkedIn</span>
                                                </>
                                            );
                                        case 'mastodon':
                                            return (
                                                <>
                                                    <MastodonIcon className="inline-block" />
                                                    <span>Mastodon</span>
                                                </>
                                            );
                                        case 'github':
                                            return (
                                                <>
                                                    <GitHubIcon className="inline-block" />
                                                    <span>GitHub</span>
                                                </>
                                            );
                                        default:
                                            return <></>;
                                    }
                                }).call(this)}
                            </Tag>
                        </a>
                    ))
                ) : (
                    <Skeleton width={64} />
                )}
            </div>
        </div>
    );
};

export default Profile;
