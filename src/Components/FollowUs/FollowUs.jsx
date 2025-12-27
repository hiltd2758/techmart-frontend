import React from 'react'

const FollowUs = () => {

    const followers= [
        {
            id:1,
            image: 'followes/follow_1',
            width: '320',
            height:'308',
        },
        {
            id:2,
            image: 'followes/follow_2',
            width: '256',
            height:'380',
        },
        {
            id:3,
            image: 'followes/follow_3',
            width: '256',
            height:'308',
        },
        {
            id:4,
            image: 'followes/follow_4',
            width: '256',
            height:'380',
        },
        {
            id:5,
            image: 'followes/follow_5',
            width: '256',
            height:'308',
        },
        {
            id:6,
            image: 'followes/follow_6',
            width: '256',
            height:'380',
        },
        {
            id:7,
            image: 'followes/follow_7',
            width: '256',
            height:'308',
        },
    ]
  return (
    <div className="w-full pb-[150px]">
        {/* header title */}
        <div className="w-full flex flex-col items-center mb-[80px]">
            <h3 className="text-5xl text=[#484848] font-normal capitalize mb-5">
                follow us on instagram
            </h3>
            <p className="text-base text-[#8a8a8a] font-poppins font-normal max-w-[614px] w-full">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies ultrices, nunc nisl aliquam nisl, eget ultricies nunc nisl eget nisl.</p>
        </div>
    <div className="flex items-center">
        {
            followers?.map((follower) => (
                <div key={follower?.id} className={`min-h-[${follower?.height}px] h-full`}>
                    <img className="w-full h-full object-cover" src={follower?.image} alt="" />
                </div>
            ))
        }
    </div>
    </div>

  )
}

export default FollowUs