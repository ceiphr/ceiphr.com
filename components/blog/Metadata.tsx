import { FunctionComponent, useState } from 'react';

import { Tab } from '@headlessui/react';
import classNames from 'classnames';

import License from '@components/blog/License';
import Changelog from '@components/github/Changelog';
import Profile from '@components/github/Profile';
import Histogram from '@components/simple-analytics/Histogram';
import Referrals from '@components/simple-analytics/Referrals';

interface Props {
    slug: string;
    frontmatter: Frontmatter;
}

// TODO Make styled pixel height responsive

const Metadata: FunctionComponent<Props> = ({ slug, frontmatter }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <Tab.Group
            selectedIndex={selectedIndex}
            onChange={setSelectedIndex}
            as="div"
            className="my-4"
        >
            <div className="flex justify-between">
                <Tab.List className="space-x-4">
                    <Tab>
                        {({ selected }) => (
                            <span
                                className={classNames(
                                    'text-gray-400 hover:text-gray-100',
                                    selected && 'text-gray-100'
                                )}
                            >
                                Details
                            </span>
                        )}
                    </Tab>
                    <Tab>
                        {({ selected }) => (
                            <span
                                className={classNames(
                                    'text-gray-400 hover:text-gray-100',
                                    selected && 'text-gray-100'
                                )}
                            >
                                Viewership
                            </span>
                        )}
                    </Tab>
                </Tab.List>
                <p className="text-gray-600 text-sm">
                    Powered by{' '}
                    {(() => {
                        switch (selectedIndex) {
                            case 0:
                                return (
                                    <a
                                        href="https://github.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        GitHub
                                    </a>
                                );
                            case 1:
                                return (
                                    <a
                                        href="https://www.simpleanalytics.com/?referral=ari"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        Simple Analytics
                                    </a>
                                );
                        }
                    }).call(this)}{' '}
                </p>
            </div>
            <Tab.Panels className="my-4 h-[280px]">
                <Tab.Panel>
                    <div className="flex flex-row  divide-x divide-gray-800">
                        <div className="basis-1/2 pr-4">
                            <h2 className="text-xl font-heading">Author</h2>
                            <Profile className="my-2" />
                            <div className="flex flex-row justify-between">
                                <div>
                                    <h2 className="font-bold">Last Updated</h2>
                                    <p className="text-gray-400">
                                        {new Date(
                                            frontmatter.date ?? ''
                                        ).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <h2 className="font-bold">License</h2>
                                    <License
                                        className="text-gray-400"
                                        license={frontmatter.license ?? 'none'}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="basis-1/2 pl-4">
                            <h2 className="text-xl font-heading">Changelog</h2>
                            <Changelog
                                className="my-2 h-[236px]"
                                path={`content/posts/${slug}.mdx`}
                                length={30}
                            />
                        </div>
                    </div>
                </Tab.Panel>
                <Tab.Panel>
                    <div className="grid divide-x divide-gray-800 grid-cols-3">
                        <Referrals className="pr-4" />
                        <Histogram
                            className="col-span-2 pl-4"
                            route={`blog/${slug}`}
                        />
                    </div>
                </Tab.Panel>
            </Tab.Panels>
        </Tab.Group>
    );
};

export default Metadata;
