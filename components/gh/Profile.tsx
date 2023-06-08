import Image from 'next/image';
import { FunctionComponent, useEffect, useState } from 'react';

import {
    MarkGithubIcon as GitHubIcon,
    LocationIcon,
    OrganizationIcon
} from '@primer/octicons-react';
import {
    FaLinkedin as LinkedInIcon,
    FaMastodon as MastodonIcon
} from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';

import Icon from '@components/Icon';
import { fetchProfile } from '@utils/fetch';

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
        fetchProfile().then((profile) => {
            const socials = [
                {
                    provider: 'github',
                    url: profile.url
                },
                ...profile.socials
            ];

            setProfile({ ...profile, socials });
        });
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
                    <p className="leading-5 text-gray-400">
                        {profile ? (
                            profile.socials.map((social) => (
                                <a
                                    key={social.provider}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {(() => {
                                        switch (social.provider) {
                                            case 'linkedin':
                                                return (
                                                    <LinkedInIcon className="inline-block mr-2" />
                                                );
                                            case 'mastodon':
                                                return (
                                                    <MastodonIcon className="inline-block mr-2" />
                                                );
                                            case 'github':
                                                return (
                                                    <GitHubIcon className="inline-block mr-2" />
                                                );
                                            default:
                                                return <></>;
                                        }
                                    }).call(this)}
                                </a>
                            ))
                        ) : (
                            <Skeleton width={64} />
                        )}
                    </p>
                </div>
            </div>
            <div className="my-2 space-y-1 text-gray-400">
                {profile?.company ? (
                    <p>
                        <Icon name="work" className="inline-block mr-2" />

                        {profile?.company}
                    </p>
                ) : (
                    <Skeleton width={250} />
                )}
                {profile?.location ? (
                    <p>
                        <Icon name="location" className="inline-block mr-2" />
                        {profile?.location}
                    </p>
                ) : (
                    <Skeleton width={120} />
                )}
                <p>
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
    );
};

export default Profile;
